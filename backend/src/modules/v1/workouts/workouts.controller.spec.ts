import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import { WorkoutResponseDto } from './dto/workout-response.dto';

class MockAuthGuard {
  canActivate() {
    return true;
  }
}
class MockRolesGuard {
  canActivate() {
    return true;
  }
}

describe('WorkoutsController', () => {
  let controller: WorkoutsController;
  let service: DeepMockProxy<WorkoutsService>;
  const user = { id: 1, email: 't@e.com', role: 'USER' };

  beforeEach(async () => {
    service = mockDeep<WorkoutsService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
      providers: [{ provide: WorkoutsService, useValue: service }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(MockAuthGuard)
      .overrideGuard(RolesGuard)
      .useClass(MockRolesGuard)
      .compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create calls service and returns dto', async () => {
    const dto = { name: 'W1' };
    const workout = {
      id: 'w1',
      name: 'W1',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
      workoutTemplateId: null,
      userId: 1,
    } as any;
    service.create.mockResolvedValue(workout);
    const res = await controller.create(user as any, dto as any);
    expect(service.create).toHaveBeenCalledWith(user.id, dto);
    expect(res).toEqual(new WorkoutResponseDto(workout));
  });

  it('createFromTemplate calls copyFromTemplate', async () => {
    const workout = {
      id: 'w2',
      name: 'W2',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
      workoutTemplateId: 'tpl1',
      userId: 1,
    } as any;
    service.copyFromTemplate.mockResolvedValue(workout);
    const res = await controller.createFromTemplate(user as any, 'tpl1');
    expect(service.copyFromTemplate).toHaveBeenCalledWith('tpl1', user.id);
    expect(res).toEqual(new WorkoutResponseDto(workout));
  });

  it('findAll maps to DTOs', async () => {
    const workout = {
      id: 'w1',
      name: 'n',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
      workoutTemplateId: null,
      userId: 1,
    } as any;
    service.findAll.mockResolvedValue([workout]);
    const res = await controller.findAll(user as any);
    expect(service.findAll).toHaveBeenCalledWith(user.id);
    expect(res).toEqual([new WorkoutResponseDto(workout)]);
  });

  it('findAllAdmin requires ADMIN role', () => {
    const roles = Reflect.getMetadata(
      ROLES_KEY,
      WorkoutsController.prototype.findAllAdmin,
    );
    expect(roles).toContain('ADMIN');
  });

  it('findAllAdmin maps to DTOs', async () => {
    const workout = {
      id: 'w1',
      name: 'n',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
      workoutTemplateId: null,
      userId: 1,
    } as any;
    service.findAllAdmin.mockResolvedValue([workout]);
    const res = await controller.findAllAdmin();
    expect(service.findAllAdmin).toHaveBeenCalled();
    expect(res).toEqual([new WorkoutResponseDto(workout)]);
  });

  it('findOne returns dto', async () => {
    const workout = {
      id: 'w3',
      name: 'X',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
      workoutTemplateId: null,
      userId: 1,
    } as any;
    service.findOne.mockResolvedValue(workout);
    const res = await controller.findOne(user as any, 'w3');
    expect(service.findOne).toHaveBeenCalledWith('w3', user.id);
    expect(res).toEqual(new WorkoutResponseDto(workout));
  });

  it('update calls service and returns dto', async () => {
    const workout = {
      id: 'w3',
      name: 'Y',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: null,
      workoutTemplateId: null,
      userId: 1,
    } as any;
    service.update.mockResolvedValue(workout);
    const dto = { name: 'Y' };
    const res = await controller.update(user as any, 'w3', dto as any);
    expect(service.update).toHaveBeenCalledWith('w3', dto, user.id);
    expect(res).toEqual(new WorkoutResponseDto(workout));
  });

  it('remove calls service', async () => {
    service.remove.mockResolvedValue(undefined as any);
    await controller.remove(user as any, 'w3');
    expect(service.remove).toHaveBeenCalledWith('w3', user.id);
  });

  it('addExercise delegates to service', async () => {
    service.addExercise.mockResolvedValue({ id: 'ex1' } as any);
    const dto = { exerciseId: 1, position: 1 };
    const res = await controller.addExercise(user as any, 'w1', dto as any);
    expect(service.addExercise).toHaveBeenCalledWith('w1', user.id, dto);
    expect(res).toEqual({ id: 'ex1' });
  });

  it('fetchExercises maps to DTO', async () => {
    const exercise = {
      id: 'ex1',
      workoutId: 'w1',
      exerciseId: 2,
      position: 1,
      exercise: {
        id: 2,
        name: 'Push',
        primaryMuscle: 'Chest',
        equipment: null,
        default: true,
        description: 'desc',
      },
    } as any;
    service.getExercises.mockResolvedValue([exercise]);
    const res = await controller.fetchExercises(user as any, 'w1');
    expect(service.getExercises).toHaveBeenCalledWith('w1', user.id);
    expect(res).toEqual([
      {
        workoutExerciseId: 'ex1',
        exerciseId: 2,
        position: 1,
        name: 'Push',
        primaryMuscle: 'Chest',
        equipment: null,
        isDefault: true,
        description: 'desc',
      },
    ]);
  });

  it('updateExercise delegates to service', async () => {
    service.updateExercise.mockResolvedValue({ id: 'ex1' } as any);
    const dto = { position: 2 };
    await controller.updateExercise(user as any, 'w1', 'ex1', dto as any);
    expect(service.updateExercise).toHaveBeenCalledWith(
      'w1',
      'ex1',
      user.id,
      dto,
    );
  });

  it('removeExercise delegates to service', async () => {
    service.removeExercise.mockResolvedValue(undefined as any);
    await controller.removeExercise(user as any, 'w1', 'ex1');
    expect(service.removeExercise).toHaveBeenCalledWith('w1', 'ex1', user.id);
  });

  it('addSet delegates to service', async () => {
    service.addSet.mockResolvedValue({ id: 's1' } as any);
    const dto = { reps: 5, weight: 50, position: 1 };
    const res = await controller.addSet(user as any, 'ex1', dto as any);
    expect(service.addSet).toHaveBeenCalledWith('ex1', user.id, dto);
    expect(res).toEqual({ id: 's1' });
  });

  it('getSets delegates to service', async () => {
    service.getSets.mockResolvedValue([{ id: 's1' }] as any);
    const res = await controller.getSets(user as any, 'ex1', 'w1');
    expect(service.getSets).toHaveBeenCalledWith('ex1', 'w1', user.id);
    expect(res).toEqual([{ id: 's1' }]);
  });

  it('updateSet delegates to service', async () => {
    service.updateSet.mockResolvedValue({ id: 's1' } as any);
    const dto = { reps: 10 };
    await controller.updateSet(user as any, 's1', dto as any);
    expect(service.updateSet).toHaveBeenCalledWith('s1', user.id, dto);
  });

  it('removeSet delegates to service', async () => {
    service.removeSet.mockResolvedValue(undefined as any);
    await controller.removeSet(user as any, 's1');
    expect(service.removeSet).toHaveBeenCalledWith('s1', user.id);
  });

  it('getExerciseProgress delegates to service and maps to DTO', async () => {
    const progress = [
      { date: '2024-01-01', volume: 100 },
      { date: '2024-01-02', volume: 150 },
    ];
    service.getExerciseProgress.mockResolvedValue(progress);
    const res = await controller.getExerciseProgress(user as any, 2);
    expect(service.getExerciseProgress).toHaveBeenCalledWith(user.id, 2);
    expect(res).toEqual(progress);
  });
});
