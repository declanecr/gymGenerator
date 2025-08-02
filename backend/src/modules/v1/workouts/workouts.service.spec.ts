/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsService } from './workouts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createMockPrismaService,
  MockedPrismaService,
} from '../../../../test/utils/createMockPrismaService';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let prisma: MockedPrismaService;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WorkoutsService>(WorkoutsService);
  });

  it('create happy path', async () => {
    const workout = {
      id: 'w1',
      name: 'W',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    } as any;
    prisma.workout.create.mockResolvedValue(workout);
    const dto = { name: 'W' } as any;
    const res = await service.create(1, dto);
    expect(prisma.workout.create).toHaveBeenCalled();
    expect(res).toBe(workout);
  });

  it('create propagates errors', async () => {
    prisma.workout.create.mockRejectedValue(new Error('fail'));
    await expect(service.create(1, { name: 'w' } as any)).rejects.toThrow(
      'fail',
    );
  });

  describe('copyFromTemplate', () => {
    it('throws if template not found', async () => {
      prisma.templateWorkout.findFirst.mockResolvedValue(null);
      await expect(service.copyFromTemplate('tid', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('creates workout from template', async () => {
      const template = {
        id: 't1',
        name: 'T',
        notes: 'n',
        templateExercises: [
          {
            id: 'te1',
            exerciseId: 2,
            position: 1,
            sets: [{ reps: 5, weight: 50, position: 1 }],
          },
        ],
      } as any;
      prisma.templateWorkout.findFirst.mockResolvedValue(template);
      prisma.workout.create.mockResolvedValue({ id: 'w1' } as any);
      const res = await service.copyFromTemplate('t1', 1);
      expect(prisma.workout.create).toHaveBeenCalled();
      expect(res).toEqual({ id: 'w1' });
    });
  });

  describe('update', () => {
    it('updates when owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as any);
      prisma.workout.update.mockResolvedValue({ id: 'w1' } as any);
      const res = await service.update('w1', { name: 'N' } as any, 1);
      expect(prisma.workout.update).toHaveBeenCalled();
      expect(res).toEqual({ id: 'w1' });
    });

    it('throws if not owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 2,
      } as any);
      await expect(service.update('w1', {} as any, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('removes when owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as any);
      prisma.workout.delete.mockResolvedValue({ id: 'w1' } as any);
      await service.remove('w1', 1);
      expect(prisma.workout.delete).toHaveBeenCalled();
    });

    it('throws if not owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 2,
      } as any);
      await expect(service.remove('w1', 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addExercise', () => {
    it('adds when owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as any);
      prisma.workoutExercise.create.mockResolvedValue({ id: 'e1' } as any);
      const dto = { exerciseId: 1, position: 1 } as any;
      const res = await service.addExercise('w1', 1, dto);
      expect(prisma.workoutExercise.create).toHaveBeenCalled();
      expect(res).toEqual({ id: 'e1' });
    });

    it('forbids when not owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 2,
      } as any);
      await expect(service.addExercise('w1', 1, {} as any)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateExercise/removeExercise', () => {
    it('updateExercise works', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as any);
      prisma.workoutExercise.update.mockResolvedValue({ id: 'e1' } as any);
      const res = await service.updateExercise('w1', 'e1', 1, {
        position: 2,
      } as any);
      expect(prisma.workoutExercise.update).toHaveBeenCalled();
      expect(res).toEqual({ id: 'e1' });
    });

    it('removeExercise works', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as any);
      prisma.workoutExercise.delete.mockResolvedValue({ id: 'e1' } as any);
      await service.removeExercise('w1', 'e1', 1);
      expect(prisma.workoutExercise.delete).toHaveBeenCalled();
    });

    it('forbids update when not owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 2,
      } as any);
      await expect(
        service.updateExercise('w1', 'e1', 1, {} as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('add/update/remove set', () => {
    it('addSet works', async () => {
      prisma.workoutExercise.findUnique.mockResolvedValue({
        workout: { userId: 1 },
      } as any);
      prisma.workoutSet.create.mockResolvedValue({ id: 's1' } as any);
      const dto = { reps: 5, weight: 50, position: 1 } as any;
      const res = await service.addSet('e1', 1, dto);
      expect(prisma.workoutSet.create).toHaveBeenCalled();
      expect(res).toEqual({ id: 's1' });
    });

    it('updateSet works', async () => {
      prisma.workoutSet.findUnique.mockResolvedValue({
        workoutExercise: { workout: { userId: 1 } },
      } as any);
      prisma.workoutSet.update.mockResolvedValue({ id: 's1' } as any);
      const res = await service.updateSet('s1', 1, { reps: 10 } as any);
      expect(prisma.workoutSet.update).toHaveBeenCalled();
      expect(res).toEqual({ id: 's1' });
    });

    it('removeSet works', async () => {
      prisma.workoutSet.findUnique.mockResolvedValue({
        workoutExercise: { workout: { userId: 1 } },
      } as any);
      prisma.workoutSet.delete.mockResolvedValue({ id: 's1' } as any);
      await service.removeSet('s1', 1);
      expect(prisma.workoutSet.delete).toHaveBeenCalled();
    });

    it('forbids when not owner', async () => {
      prisma.workoutExercise.findUnique.mockResolvedValue({
        workout: { userId: 2 },
      } as any);
      await expect(service.addSet('e1', 1, {} as any)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  it('getExercises returns list', async () => {
    prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 1 } as any);
    prisma.workoutExercise.findMany.mockResolvedValue([{ id: 'e1' }] as any);
    const res = await service.getExercises('w1', 1);
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('getSets returns list', async () => {
    prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 1 } as any);
    prisma.workoutSet.findMany.mockResolvedValue([{ id: 's1' }] as any);
    const res = await service.getSets('e1', 'w1', 1);
    expect(res).toEqual([{ id: 's1' }]);
  });
});
