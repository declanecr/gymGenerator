import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { Exercise } from '@prisma/client';
import { CreateCustomExerciseDto } from './dto/create-custom-exercise.dto';
import { UpdateCustomExerciseDto } from './dto/update-custom-exercise.dto';

@Injectable()
export class ExercisesCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  private ensureOwnsExerciseOrThrow(exercise: Exercise, userId: number): void {
    if (!exercise || exercise.userId !== userId || exercise.default) {
      throw new ForbiddenException(
        'You do not have oversight to do that action',
      );
    }
  }

  // Called before creating a custom exercise
  async isNameTakenByDefault(name: string): Promise<boolean> {
    return (
      (await this.prisma.exercise.findFirst({
        where: {
          name,
          default: true,
        },
      })) !== null
    );
  }

  // Fetch user-visible catalog
  async getVisibleExercises(
    userId: number,
    showCustom: boolean,
  ): Promise<Exercise[]> {
    return await this.prisma.exercise.findMany({
      where: {
        OR: [{ default: true }, ...(showCustom ? [{ userId }] : [])],
      },
    });
  }

  async createCustomExercise(userId: number, dto: CreateCustomExerciseDto) {
    const nameConflict = await this.isNameTakenByDefault(dto.name);
    if (nameConflict) {
      throw new ConflictException(
        'This name is reserved by a default exercise.',
      );
    }
    return await this.prisma.exercise.create({
      data: {
        ...dto,
        default: false,
        userId,
      },
    });
  }

  async getById(id: number, userId: number): Promise<Exercise> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: id },
    });

    if (!exercise || (!exercise.default && exercise.userId !== userId)) {
      throw new ForbiddenException('Not allowed to view this exercise.');
    }

    return exercise;
  }

  async updateCustomExercise(
    id: number,
    dto: UpdateCustomExerciseDto,
    userId: number,
  ) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new ForbiddenException('Exercise not found or not yours.');
    }

    this.ensureOwnsExerciseOrThrow(exercise, userId);

    // ⚠ Prevent renaming to a default exercise name
    if (
      dto.name &&
      dto.name !== exercise.name &&
      (await this.isNameTakenByDefault(dto.name))
    ) {
      throw new ConflictException(
        'This name is reserved by a default exercise.',
      );
    }
    return this.prisma.exercise.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deleteCustomExercise(id: number, userId: number): Promise<void> {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });

    if (!exercise || exercise.userId !== userId || exercise.default) {
      throw new ForbiddenException('Not allowed to delete this exercise.');
    }

    await this.prisma.exercise.delete({ where: { id: id } });
  }
}
