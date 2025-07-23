import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateWorkoutDto } from './dto/create-template-workout.dto';
import { UpdateTemplateWorkoutDto } from './dto/update-template-workout.dto';
import { CreateTemplateExerciseDto } from './dto/create-template-exercise.dto';
import { UpdateTemplateExerciseDto } from './dto/update-template-exercise.dto';
import { CreateTemplateSetDto } from './dto/create-template-set.dto';
import { UpdateTemplateSetDto } from './dto/update-template-set.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TemplateWorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateTemplateWorkoutDto) {
    return this.prisma.templateWorkout.create({
      data: { ...dto, userId },
    });
  }

  async createGlobal(dto: CreateTemplateWorkoutDto) {
    return this.prisma.templateWorkout.create({
      data: { ...dto, userId: null },
    });
  }

  async findAll(userId: number) {
    return this.prisma.templateWorkout.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
      },
      include: {
        templateExercises: {
          include: { exercise: true, sets: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: number, role?: string) {
    await this.ensureOwnership(id, userId, role);
    return this.prisma.templateWorkout.findUnique({
      where: { id },
      include: {
        templateExercises: {
          include: { exercise: true, sets: true },
        },
      },
    });
  }

  async update(
    id: string,
    userId: number,
    dto: UpdateTemplateWorkoutDto,
    role?: string,
  ) {
    await this.ensureEditableOwnership(id, userId, role);
    return this.prisma.templateWorkout.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: number, role?: string) {
    await this.ensureEditableOwnership(id, userId, role);
    await this.prisma.templateWorkout.delete({ where: { id } });
  }

  private async ensureOwnership(id: string, userId: number, role?: string) {
    const workout = await this.prisma.templateWorkout.findUnique({
      where: { id },
    });
    if (!workout) {
      throw new NotFoundException('No workout found');
    }
    if (
      workout.userId !== null &&
      workout.userId !== userId &&
      role !== 'ADMIN'
    ) {
      throw new ForbiddenException('Not allowed');
    }
  }

  private async ensureEditableOwnership(
    id: string,
    userId: number,
    role?: string,
  ) {
    const workout = await this.prisma.templateWorkout.findUnique({
      where: { id },
    });
    if (!workout) {
      throw new NotFoundException('No workout found');
    }
    // if global but not ADMIN
    if (workout.userId === null && role !== 'ADMIN') {
      throw new ForbiddenException('Not allowed');
    }
    // if NOT global, BUT (wrong user OR NOT admin)
    if (
      workout.userId !== null &&
      workout.userId !== userId &&
      role !== 'ADMIN'
    ) {
      throw new ForbiddenException('Not allowed');
    }
  }

  // --- Exercises ---
  async getExercises(templateId: string, userId: number, role?: string) {
    await this.ensureOwnership(templateId, userId, role);
    return this.prisma.templateExercise.findMany({
      where: { workoutTemplateId: templateId },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            primaryMuscle: true,
            equipment: true,
            default: true,
            description: true,
          },
        },
      },
    });
  }

  async addExercise(
    templateId: string,
    userId: number,
    dto: CreateTemplateExerciseDto,
    role?: string,
  ) {
    await this.ensureEditableOwnership(templateId, userId, role);
    try {
      return await this.prisma.templateExercise.create({
        data: {
          workoutTemplateId: templateId,
          exerciseId: dto.exerciseId,
          position: dto.position ?? (await this.nextExercisePosition()),
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'An exercise already exists at that position',
        );
      }
      throw e;
    }
  }

  async updateExercise(
    id: string,
    exerciseId: string,
    userId: number,
    dto: UpdateTemplateExerciseDto,
    role?: string,
  ) {
    await this.ensureEditableOwnership(id, userId, role);
    try {
      return await this.prisma.templateExercise.update({
        where: { id: exerciseId },
        data: dto,
      });
    } catch (e) {
      //only handle Prisma known errors
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        //no record found -> 404
        throw new NotFoundException(
          `Template exercise ${exerciseId} does not exist`,
        );
      }
      //rethrow anything else
      throw e;
    }
  }

  async removeExercise(
    id: string,
    exerciseId: string,
    userId: number,
    role?: string,
  ) {
    await this.ensureEditableOwnership(id, userId, role);
    await this.prisma.templateExercise.delete({ where: { id: exerciseId } });
  }

  private async nextExercisePosition() {
    const max = await this.prisma.templateExercise.aggregate({
      _max: { position: true },
    });
    return (max._max.position ?? 0) + 1;
  }

  // --- Sets ---
  async getSets(
    exerciseId: string,
    templateId: string,
    userId: number,
    role?: string,
  ) {
    await this.ensureOwnership(templateId, userId, role);
    return this.prisma.templateSet.findMany({
      where: { templateExerciseId: exerciseId },
    });
  }

  async addSet(
    exerciseId: string,
    userId: number,
    dto: CreateTemplateSetDto,
    role?: string,
  ) {
    const exercise = await this.prisma.templateExercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise) throw new NotFoundException('Exercise not found');
    await this.ensureEditableOwnership(
      exercise.workoutTemplateId,
      userId,
      role,
    );
    try {
      return await this.prisma.templateSet.create({
        data: {
          templateExerciseId: exerciseId,
          reps: dto.reps,
          weight: dto.weight,
          position: dto.position ?? (await this.nextSetPosition()),
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'An exercise already exists at that position',
        );
      }
      throw e;
    }
  }

  async updateSet(
    setId: string,
    userId: number,
    dto: UpdateTemplateSetDto,
    role?: string,
  ) {
    const set = await this.prisma.templateSet.findUnique({
      where: { id: setId },
      include: { templateExercise: true },
    });
    if (!set) throw new NotFoundException('Set not found');
    await this.ensureEditableOwnership(
      set.templateExercise.workoutTemplateId,
      userId,
      role,
    );
    return this.prisma.templateSet.update({ where: { id: setId }, data: dto });
  }

  async removeSet(setId: string, userId: number, role?: string) {
    const set = await this.prisma.templateSet.findUnique({
      where: { id: setId },
      include: { templateExercise: true },
    });
    if (!set) throw new NotFoundException('Set not found');
    await this.ensureEditableOwnership(
      set.templateExercise.workoutTemplateId,
      userId,
      role,
    );
    await this.prisma.templateSet.delete({ where: { id: setId } });
  }

  private async nextSetPosition() {
    const max = await this.prisma.templateSet.aggregate({
      _max: { position: true },
    });
    return (max._max.position ?? 0) + 1;
  }
}
