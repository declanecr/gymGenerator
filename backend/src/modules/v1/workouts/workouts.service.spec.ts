import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkoutsService } from './workouts.service';

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new WorkoutsService(prisma);
  });

  describe('create', () => {
    it('creates workout', async () => {
      prisma.workout.create.mockResolvedValue({ id: 'w1' } as never);
      await service.create(1, { name: 'A' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workout.create).toHaveBeenCalled();
    });

    it('propagates errors', async () => {
      prisma.workout.create.mockRejectedValue(new Error('fail'));
      await expect(service.create(1, { name: 'A' })).rejects.toThrow('fail');
    });
  });

  describe('copyFromTemplate', () => {
    it('throws when template missing', async () => {
      prisma.templateWorkout.findFirst.mockResolvedValue(null);
      await expect(service.copyFromTemplate('tid', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('creates workout from template', async () => {
      prisma.templateWorkout.findFirst.mockResolvedValue({
        id: 't',
        name: 'T',
        notes: 'N',
        templateExercises: [
          {
            id: 'te1',
            exerciseId: 2,
            position: 1,
            sets: [{ reps: 5, weight: 10, position: 1 }],
          },
        ],
      } as never);
      prisma.workout.create.mockResolvedValue({ id: 'w' } as never);
      await service.copyFromTemplate('t', 1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workout.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates when owner matches', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as never);
      prisma.workout.update.mockResolvedValue({ id: 'w1' } as never);
      await service.update('w1', { name: 'B' }, 1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workout.update).toHaveBeenCalledWith({
        where: { id: 'w1' },
        data: { name: 'B' },
      });
    });

    it('throws when not owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 2,
      } as never);
      await expect(service.update('w1', { name: 'B' }, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deletes when owner matches', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as never);
      prisma.workout.delete.mockResolvedValue({ id: 'w1' } as never);
      await service.remove('w1', 1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workout.delete).toHaveBeenCalledWith({
        where: { id: 'w1' },
      });
    });

    it('throws when workout missing', async () => {
      prisma.workout.findUnique.mockResolvedValue(null);
      await expect(service.remove('w1', 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addExercise', () => {
    it('checks ownership', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as never);
      prisma.workoutExercise.create.mockResolvedValue({ id: 'e1' } as never);
      await service.addExercise('w1', 1, { exerciseId: 2, position: 1 });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workoutExercise.create).toHaveBeenCalled();
    });

    it('forbids when not owner', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 2,
      } as never);
      await expect(
        service.addExercise('w1', 1, { exerciseId: 2, position: 1 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addSet', () => {
    it('creates set when owner matches', async () => {
      prisma.workoutExercise.findUnique.mockResolvedValue({
        id: 'e1',
        workout: { userId: 1 },
      } as never);
      prisma.workoutSet.create.mockResolvedValue({ id: 's1' } as never);
      await service.addSet('e1', 1, { reps: 5, weight: 10, position: 1 });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workoutSet.create).toHaveBeenCalled();
    });

    it('forbids when not owner', async () => {
      prisma.workoutExercise.findUnique.mockResolvedValue({
        id: 'e1',
        workout: { userId: 2 },
      } as never);
      await expect(
        service.addSet('e1', 1, { reps: 5, weight: 10, position: 1 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getExercises', () => {
    it('returns list', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as never);
      prisma.workoutExercise.findMany.mockResolvedValue([]);
      await service.getExercises('w1', 1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workoutExercise.findMany).toHaveBeenCalled();
    });
  });

  describe('getSets', () => {
    it('returns sets', async () => {
      prisma.workout.findUnique.mockResolvedValue({
        id: 'w1',
        userId: 1,
      } as never);
      prisma.workoutSet.findMany.mockResolvedValue([]);
      await service.getSets('e1', 'w1', 1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.workoutSet.findMany).toHaveBeenCalled();
    });
  });
});
