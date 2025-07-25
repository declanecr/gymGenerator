import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { UpdateWorkoutSetDto } from './dto/update-workout-set.dto';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateWorkoutDto) {
    return this.prisma.workout.create({
      data: {
        userId,
        workoutTemplateId: dto.workoutTemplateId ?? null,
        name: dto.name,
        notes: dto.notes,
      },
    });
  }

  async copyFromTemplate(templateId: string, userId: number) {
    const template = await this.prisma.templateWorkout.findFirst({
      where: {
        id: templateId,
        OR: [{ userId }, { userId: null }],
      },
      include: {
        templateExercises: { include: { sets: true } },
      },
    });
    if (!template) throw new NotFoundException('Template not found');

    return this.prisma.workout.create({
      data: {
        userId,
        workoutTemplateId: template.id,
        name: template.name,
        notes: template.notes,
        workoutExercises: {
          create: template.templateExercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            templateExerciseId: ex.id,
            position: ex.position,
            workoutSets: {
              create: ex.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
                position: set.position,
              })),
            },
          })),
        },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.workout.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: number) {
    const workout = await this.prisma.workout.findUnique({ where: { id } });
    if (!workout || workout.userId !== userId) {
      throw new NotFoundException('Workout not found');
    }
    return workout;
  }

  async update(id: string, dto: UpdateWorkoutDto, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.workout.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.workout.delete({ where: { id } });
  }

  private async ensureExerciseOwner(workoutId: string, userId: number) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });
    if (!workout || workout.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
  }

  async addExercise(
    workoutId: string,
    userId: number,
    dto: CreateWorkoutExerciseDto,
  ) {
    await this.ensureExerciseOwner(workoutId, userId);
    return this.prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: dto.exerciseId,
        templateExerciseId: dto.templateExerciseId ?? null,
        position: dto.position,
      },
    });
  }

  async getExercises(workoutId: string, userId: number) {
    await this.ensureExerciseOwner(workoutId, userId);
    return this.prisma.workoutExercise.findMany({
      where: { workoutId: workoutId },
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

  async updateExercise(
    workoutId: string,
    exerciseId: string,
    userId: number,
    dto: UpdateWorkoutExerciseDto,
  ) {
    await this.ensureExerciseOwner(workoutId, userId);
    return this.prisma.workoutExercise.update({
      where: { id: exerciseId },
      data: {
        ...(dto.exerciseId !== undefined && { exerciseId: dto.exerciseId }),
        ...(dto.templateExerciseId !== undefined && {
          templateExerciseId: dto.templateExerciseId,
        }),
        ...(dto.position !== undefined && { position: dto.position }),
      },
    });
  }

  async removeExercise(workoutId: string, exerciseId: string, userId: number) {
    await this.ensureExerciseOwner(workoutId, userId);
    return this.prisma.workoutExercise.delete({ where: { id: exerciseId } });
  }

  async addSet(exerciseId: string, userId: number, dto: CreateWorkoutSetDto) {
    // fetch exercise and verify belongs to user's workout
    const exercise = await this.prisma.workoutExercise.findUnique({
      where: { id: exerciseId },
      include: { workout: true },
    });
    if (!exercise || exercise.workout.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    return this.prisma.workoutSet.create({
      data: {
        workoutExerciseId: exerciseId,
        reps: dto.reps,
        weight: dto.weight,
        position: dto.position,
      },
    });
  }

  async getSets(workoutExerciseId: string, workoutId: string, userId: number) {
    await this.ensureExerciseOwner(workoutId, userId);
    return this.prisma.workoutSet.findMany({
      //should be confined to only sets withing this workout, under the specified exercise
      where: { workoutExerciseId: workoutExerciseId },
    });
  }

  async updateSet(setId: string, userId: number, dto: UpdateWorkoutSetDto) {
    const set = await this.prisma.workoutSet.findUnique({
      where: { id: setId },
      include: { workoutExercise: { include: { workout: true } } },
    });
    if (!set || set.workoutExercise.workout.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    return this.prisma.workoutSet.update({
      where: { id: setId },
      data: {
        ...(dto.reps !== undefined && { reps: dto.reps }),
        ...(dto.weight !== undefined && { weight: dto.weight }),
        ...(dto.position !== undefined && { position: dto.position }),
      },
    });
  }

  async removeSet(setId: string, userId: number) {
    const set = await this.prisma.workoutSet.findUnique({
      where: { id: setId },
      include: { workoutExercise: { include: { workout: true } } },
    });
    if (!set || set.workoutExercise.workout.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    return this.prisma.workoutSet.delete({ where: { id: setId } });
  }
}
