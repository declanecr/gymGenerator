import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateWorkoutDto } from './dto/create-template-workout.dto';
import { UpdateTemplateWorkoutDto } from './dto/update-template-workout.dto';
import { CreateTemplateExerciseDto } from './dto/create-template-exercise.dto';
import { UpdateTemplateExerciseDto } from './dto/update-template-exercise.dto';
import { CreateTemplateSetDto } from './dto/create-template-set.dto';
import { UpdateTemplateSetDto } from './dto/update-template-set.dto';

@Injectable()
export class TemplateWorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateTemplateWorkoutDto) {
    return this.prisma.templateWorkout.create({
      data: { ...dto, userId },
    });
  }

  async findAll(userId: number) {
    return this.prisma.templateWorkout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: number) {
    const workout = await this.prisma.templateWorkout.findFirst({
      where: { id, userId },
      include: {
        templateExercises: {
          include: { sets: true, exercise: true },
        },
      },
    });
    if (!workout) throw new NotFoundException('Template not found');
    return workout;
  }

  async update(id: string, userId: number, dto: UpdateTemplateWorkoutDto) {
    await this.ensureOwnership(id, userId);
    return this.prisma.templateWorkout.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: number) {
    await this.ensureOwnership(id, userId);
    await this.prisma.templateWorkout.delete({ where: { id } });
  }

  private async ensureOwnership(id: string, userId: number) {
    const workout = await this.prisma.templateWorkout.findUnique({
      where: { id },
    });
    if (!workout || workout.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
  }

  // --- Exercises ---
  async addExercise(
    templateId: string,
    userId: number,
    dto: CreateTemplateExerciseDto,
  ) {
    await this.ensureOwnership(templateId, userId);
    return this.prisma.templateExercise.create({
      data: {
        workoutTemplateId: templateId,
        exerciseId: dto.exerciseId,
        position: dto.position ?? (await this.nextExercisePosition()),
      },
    });
  }

  async updateExercise(
    id: string,
    exerciseId: string,
    userId: number,
    dto: UpdateTemplateExerciseDto,
  ) {
    await this.ensureOwnership(id, userId);
    return this.prisma.templateExercise.update({
      where: { id: exerciseId },
      data: dto,
    });
  }

  async removeExercise(id: string, exerciseId: string, userId: number) {
    await this.ensureOwnership(id, userId);
    await this.prisma.templateExercise.delete({ where: { id: exerciseId } });
  }

  private async nextExercisePosition() {
    const max = await this.prisma.templateExercise.aggregate({
      _max: { position: true },
    });
    return (max._max.position ?? 0) + 1;
  }

  // --- Sets ---
  async addSet(exerciseId: string, userId: number, dto: CreateTemplateSetDto) {
    const exercise = await this.prisma.templateExercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise) throw new NotFoundException('Exercise not found');
    await this.ensureOwnership(exercise.workoutTemplateId, userId);
    return this.prisma.templateSet.create({
      data: {
        templateExerciseId: exerciseId,
        reps: dto.reps,
        weight: dto.weight,
        position: dto.position ?? (await this.nextSetPosition()),
      },
    });
  }

  async updateSet(setId: string, userId: number, dto: UpdateTemplateSetDto) {
    const set = await this.prisma.templateSet.findUnique({
      where: { id: setId },
      include: { templateExercise: true },
    });
    if (!set) throw new NotFoundException('Set not found');
    await this.ensureOwnership(set.templateExercise.workoutTemplateId, userId);
    return this.prisma.templateSet.update({ where: { id: setId }, data: dto });
  }

  async removeSet(setId: string, userId: number) {
    const set = await this.prisma.templateSet.findUnique({
      where: { id: setId },
      include: { templateExercise: true },
    });
    if (!set) throw new NotFoundException('Set not found');
    await this.ensureOwnership(set.templateExercise.workoutTemplateId, userId);
    await this.prisma.templateSet.delete({ where: { id: setId } });
  }

  private async nextSetPosition() {
    const max = await this.prisma.templateSet.aggregate({
      _max: { position: true },
    });
    return (max._max.position ?? 0) + 1;
  }
}
