 
import { TemplateWorkoutsService } from './template-workouts.service';
import {
  createMockPrismaService,
  MockedPrismaService,
} from '../../../../test/utils/createMockPrismaService';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TemplateExercise, TemplateSet, TemplateWorkout } from '@prisma/client';
import { CreateTemplateExerciseDto } from './dto/create-template-exercise.dto';
import { CreateTemplateSetDto } from './dto/create-template-set.dto';
import { CreateTemplateWorkoutDto } from './dto/create-template-workout.dto';
import { UpdateTemplateWorkoutDto } from './dto/update-template-workout.dto';

describe('TemplateWorkoutsService', () => {
  let service: TemplateWorkoutsService;
  let prisma: MockedPrismaService;

  beforeEach(() => {
    prisma = createMockPrismaService();
    service = new TemplateWorkoutsService(prisma);
  });

  it('creates a user template', async () => {
    prisma.templateWorkout.create.mockResolvedValue({
      id: '1',
      userId: 1,
    } as unknown as TemplateWorkout);
    const dto: CreateTemplateWorkoutDto = { name: 'A' };
    const res = await service.create(1, dto);
    expect(res).toEqual({ id: '1', userId: 1 });
    expect(prisma.templateWorkout.create).toHaveBeenCalledWith({
      data: { name: 'A', userId: 1 },
    });
  });

  it('creates a global template', async () => {
    prisma.templateWorkout.create.mockResolvedValue({
      id: 'g',
      userId: null,
    } as unknown as TemplateWorkout);
    const dto: CreateTemplateWorkoutDto = { name: 'G' };
    const res = await service.createGlobal(dto);
    expect(res).toEqual({ id: 'g', userId: null });
    expect(prisma.templateWorkout.create).toHaveBeenCalledWith({
      data: { name: 'G', userId: null },
    });
  });

  it('finds all templates for user', async () => {
    prisma.templateWorkout.findMany.mockResolvedValue([
      { id: '1' },
    ] as unknown as TemplateWorkout[]);
    const res = await service.findAll(1);
    expect(res).toEqual([{ id: '1' }]);
    expect(prisma.templateWorkout.findMany).toHaveBeenCalled();
  });

  describe('findOne ownership', () => {
    it('allows owner', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue({
        id: '1',
        userId: 1,
      } as unknown as TemplateWorkout);
      const res = await service.findOne('1', 1);
      expect(res).toBeDefined();
    });

    it('allows admin reading global', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue({
        id: '1',
        userId: null,
      } as unknown as TemplateWorkout);
      await service.findOne('1', 2, 'ADMIN');
      expect(prisma.templateWorkout.findUnique).toHaveBeenCalled();
    });

    it('throws forbidden for wrong user', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue({
        id: '1',
        userId: 1,
      } as unknown as TemplateWorkout);
      await expect(service.findOne('1', 2)).rejects.toThrow(ForbiddenException);
    });

    it('throws not found', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nope', 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update ownership', () => {
    it('allows admin editing global', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue({
        id: '1',
        userId: null,
      } as unknown as TemplateWorkout);
      prisma.templateWorkout.update.mockResolvedValue({
        id: '1',
        name: 'B',
      } as unknown as TemplateWorkout);
      const dto: UpdateTemplateWorkoutDto = { name: 'B' };
      const res = await service.update('1', 2, dto, 'ADMIN');
      expect(res.name).toBe('B');
    });

    it('forbids editing global for non-admin', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue({
        id: '1',
        userId: null,
      } as unknown as TemplateWorkout);
      await expect(service.update('1', 1, { name: 'B' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('forbids wrong user edit', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue({
        id: '1',
        userId: 1,
      } as unknown as TemplateWorkout);
      await expect(service.update('1', 2, { name: 'B' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws not found on update', async () => {
      prisma.templateWorkout.findUnique.mockResolvedValue(null);
      await expect(service.update('x', 1, { name: 'B' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  it('adds exercise', async () => {
    prisma.templateWorkout.findUnique.mockResolvedValue({
      id: '1',
      userId: 1,
    } as unknown as TemplateWorkout);
    type AggExReturn = Awaited<
      ReturnType<typeof prisma.templateExercise.aggregate>
    >;
    prisma.templateExercise.aggregate.mockResolvedValue({
      _max: { position: 0 },
    } as unknown as AggExReturn);
    prisma.templateExercise.create.mockResolvedValue({
      id: 'e1',
    } as unknown as TemplateExercise);
    const dto: CreateTemplateExerciseDto = { exerciseId: 3, position: 1 };
    const res = await service.addExercise('1', 1, dto);
    expect(res).toEqual({ id: 'e1' });
  });

  it('adds set', async () => {
    prisma.templateExercise.findUnique.mockResolvedValue({
      id: 'e1',
      workoutTemplateId: '1',
    } as unknown as TemplateExercise);
    prisma.templateWorkout.findUnique.mockResolvedValue({
      id: '1',
      userId: 1,
    } as unknown as TemplateWorkout);
    type AggSetReturn = Awaited<
      ReturnType<typeof prisma.templateSet.aggregate>
    >;
    prisma.templateSet.aggregate.mockResolvedValue({
      _max: { position: 0 },
    } as unknown as AggSetReturn);
    prisma.templateSet.create.mockResolvedValue({
      id: 's1',
    } as unknown as TemplateSet);
    const dto: CreateTemplateSetDto = { reps: 5, weight: 0, position: 1 };
    const res = await service.addSet('e1', 1, dto);
    expect(res).toEqual({ id: 's1' });
  });
});
