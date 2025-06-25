import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { Exercise, User } from '@prisma/client';
import { CreateCustomExerciseDto } from './dto/create-custom-exercise.dto';
import { UpdateCustomExerciseDto } from './dto/update-custom-exercise.dto';
import { ExerciseResponseDto } from './dto/exercise-response.dto';

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
    user: User,
    showCustom: boolean,
  ): Promise<ExerciseResponseDto[]> {
    // Admin sees *everything*
    const isAdmin = user.role === 'ADMIN';

    const whereClause = isAdmin
      ? {}
      : {
          OR: [{ default: true }, ...(showCustom ? [{ userId: user.id }] : [])],
        };
    const exercises = await this.prisma.exercise.findMany({
      where: whereClause,
      orderBy: { name: 'desc' },
    });

    return exercises.map((e) => new ExerciseResponseDto(e));
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

  async getById(id: number, user: User): Promise<Exercise> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: id },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found.');
    }
    // if it’s custom, ensure the user owns it or is an admin
    if (
      !exercise.default &&
      exercise.userId !== user.id &&
      user.role !== 'ADMIN'
    ) {
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

  async searchExercises(term: string, user: User): Promise<Exercise[]> {
    // Build a “where” clause: name or description contains (case‐insensitive)
    const filter = {
      AND: [
        {
          OR: [
            { name: { contains: term } },
            { description: { contains: term } },
          ],
        },
        {
          OR: [
            { default: true },
            { userId: user.id },
            // If admin, allow also custom of others
            ...(user.role === 'ADMIN' ? [{ default: false }] : []),
          ],
        },
      ],
    };

    return this.prisma.exercise.findMany({
      where: filter,
      orderBy: { name: 'asc' },
    });
  }

  async createDefaultExercise(dto: CreateCustomExerciseDto): Promise<Exercise> {
    // 1) Check name collision among existing default exercises
    if (await this.isNameTakenByDefault(dto.name)) {
      throw new ConflictException(
        'Default exercise with this name already exists.',
      );
    }

    // 2) Create the exercise with default: true, userId: null
    return this.prisma.exercise.create({
      data: {
        name: dto.name,
        primaryMuscle: dto.primaryMuscle,
        description: dto.description,
        equipment: dto.equipment,
        default: true,
        userId: null,
      },
    });
  }
}
