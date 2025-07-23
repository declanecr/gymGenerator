/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { AuthGuard } from '@nestjs/passport';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';

class MockAuthGuard {
  canActivate() {
    return true;
  }
}

describe('WorkoutsController', () => {
  let controller: WorkoutsController;
  let service: DeepMockProxy<WorkoutsService>;

  beforeEach(async () => {
    service = mockDeep<WorkoutsService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
      providers: [{ provide: WorkoutsService, useValue: service }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
  });

  it('create calls service and returns DTO', async () => {
    const workout = {
      id: '1',
      name: 'W',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      workoutTemplateId: null,
      userId: 2,
    };
    service.create.mockResolvedValue(workout);
    const res = await controller.create({ id: 2, email: 'a' }, { name: 'W' });

    expect(service.create).toHaveBeenCalledWith(2, { name: 'W' });
    expect(res.id).toBe('1');
  });

  it('createFromTemplate calls service', async () => {
    service.copyFromTemplate.mockResolvedValue({
      id: 'w',
      name: 'n',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
      workoutTemplateId: 't',
      userId: 1,
    });
    const res = await controller.createFromTemplate({ id: 1, email: 'a' }, 't');

    expect(service.copyFromTemplate).toHaveBeenCalledWith('t', 1);
    expect(res.workoutTemplateId).toBe('t');
  });

  it('findAll returns mapped DTOs', async () => {
    service.findAll.mockResolvedValue([
      {
        id: '1',
        name: 'A',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        workoutTemplateId: null,
        userId: 3,
      },
    ]);
    const res = await controller.findAll({ id: 3, email: 'b' });

    expect(service.findAll).toHaveBeenCalledWith(3);
    expect(res[0].id).toBe('1');
  });

  it('findAllAdmin requires ADMIN role', () => {
    const roles = Reflect.getMetadata(
      ROLES_KEY,
      controller.findAllAdmin,
    ) as string[];
    expect(roles).toContain('ADMIN');
  });
  it('findAllAdmin returns DTO list', async () => {
    service.findAllAdmin.mockResolvedValue([
      {
        id: '2',
        name: 'B',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        workoutTemplateId: null,
        userId: 1,
      },
    ]);
    const res = await controller.findAllAdmin();

    expect(service.findAllAdmin).toHaveBeenCalled();
    expect(res[0].id).toBe('2');
  });

  it('findOne delegates to service', async () => {
    service.findOne.mockResolvedValue({
      id: '3',
      name: 'C',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      workoutTemplateId: null,
      userId: 5,
    });
    const res = await controller.findOne({ id: 5, email: 'c' }, '3');

    expect(service.findOne).toHaveBeenCalledWith('3', 5);
    expect(res.id).toBe('3');
  });

  it('update delegates to service', async () => {
    service.update.mockResolvedValue({
      id: '4',
      name: 'U',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      workoutTemplateId: null,
      userId: 6,
    });
    const res = await controller.update({ id: 6, email: 'd' }, '4', {});

    expect(service.update).toHaveBeenCalledWith('4', {}, 6);
    expect(res.id).toBe('4');
  });

  it('remove delegates to service', async () => {
    await controller.remove({ id: 7, email: 'e' }, '5');

    expect(service.remove).toHaveBeenCalledWith('5', 7);
  });

  it('addExercise calls service', async () => {
    service.addExercise.mockResolvedValue({ id: 'ex' } as never);
    await controller.addExercise({ id: 1, email: 'a' }, 'w1', {
      exerciseId: 2,
      position: 1,
    });

    expect(service.addExercise).toHaveBeenCalledWith('w1', 1, {
      exerciseId: 2,
      position: 1,
    });
  });

  it('fetchExercises maps service results', async () => {
    service.getExercises.mockResolvedValue([
      {
        id: 'e1',
        exerciseId: 2,
        position: 1,
        exercise: {
          id: 2,
          name: 'Bench',
          primaryMuscle: 'Chest',
          equipment: 'None',
          default: true,
          description: 'desc',
        },
      },
    ] as never);
    const res = await controller.fetchExercises({ id: 1, email: 'a' }, 'w1');

    expect(service.getExercises).toHaveBeenCalledWith('w1', 1);
    expect(res[0].exerciseId).toBe(2);
    expect(res[0].name).toBe('Bench');
  });

  it('updateExercise calls service', async () => {
    service.updateExercise.mockResolvedValue({ id: 'e1' } as never);
    await controller.updateExercise({ id: 1, email: 'a' }, 'w1', 'e1', {
      position: 2,
    });

    expect(service.updateExercise).toHaveBeenCalledWith('w1', 'e1', 1, {
      position: 2,
    });
  });

  it('removeExercise calls service', async () => {
    await controller.removeExercise({ id: 1, email: 'a' }, 'w1', 'e1');

    expect(service.removeExercise).toHaveBeenCalledWith('w1', 'e1', 1);
  });

  it('addSet calls service', async () => {
    service.addSet.mockResolvedValue({ id: 's1' } as never);
    await controller.addSet({ id: 1, email: 'a' }, 'ex1', {
      reps: 5,
      weight: 10,
      position: 1,
    });

    expect(service.addSet).toHaveBeenCalledWith('ex1', 1, {
      reps: 5,
      weight: 10,
      position: 1,
    });
  });

  it('getSets calls service', async () => {
    service.getSets.mockResolvedValue([]);
    await controller.getSets({ id: 1, email: 'a' }, 'ex1', 'w1');

    expect(service.getSets).toHaveBeenCalledWith('ex1', 'w1', 1);
  });

  it('updateSet calls service', async () => {
    service.updateSet.mockResolvedValue({ id: 's1' } as never);
    await controller.updateSet({ id: 1, email: 'a' }, 's1', { reps: 10 });

    expect(service.updateSet).toHaveBeenCalledWith('s1', 1, { reps: 10 });
  });

  it('removeSet calls service', async () => {
    await controller.removeSet({ id: 1, email: 'a' }, 's1');

    expect(service.removeSet).toHaveBeenCalledWith('s1', 1);
  });
});
