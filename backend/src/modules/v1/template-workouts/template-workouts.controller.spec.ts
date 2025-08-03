import { Test, TestingModule } from '@nestjs/testing';
import { TemplateWorkoutsController } from './template-workouts.controller';
import { TemplateWorkoutsService } from './template-workouts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';
import { CreateTemplateWorkoutDto } from './dto/create-template-workout.dto';
import { UpdateTemplateWorkoutDto } from './dto/update-template-workout.dto';
import { CreateTemplateExerciseDto } from './dto/create-template-exercise.dto';
import { UpdateTemplateExerciseDto } from './dto/update-template-exercise.dto';
import { CreateTemplateSetDto } from './dto/create-template-set.dto';
import { UpdateTemplateSetDto } from './dto/update-template-set.dto';
import {
  Exercise,
  TemplateExercise,
  TemplateSet,
  TemplateWorkout,
} from '@prisma/client';

class MockAuthGuard {
  canActivate() {
    return true;
  }
}

describe('TemplateWorkoutsController', () => {
  let controller: TemplateWorkoutsController;
  let service: DeepMockProxy<TemplateWorkoutsService>;
  const user: JwtPayload = { id: 1, email: 'a', role: 'USER' };
  const admin: JwtPayload = { id: 2, email: 'b', role: 'ADMIN' };

  beforeEach(async () => {
    service = mockDeep<TemplateWorkoutsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateWorkoutsController],
      providers: [{ provide: TemplateWorkoutsService, useValue: service }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(MockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TemplateWorkoutsController>(
      TemplateWorkoutsController,
    );
  });

  it('create user template', async () => {
    service.create.mockResolvedValue({
      id: '1',
      name: 'A',
    } as unknown as TemplateWorkout);
    const dto: CreateTemplateWorkoutDto = { name: 'A' };
    const res = await controller.create(dto, user);
    expect(res).toEqual({ id: '1', name: 'A' });
     
    expect(service.create).toHaveBeenCalledWith(user.id, dto);
  });

  it('create global template', async () => {
    service.createGlobal.mockResolvedValue({
      id: 'g',
      name: 'G',
    } as unknown as TemplateWorkout);
    const dto: CreateTemplateWorkoutDto = { name: 'G' };
    const res = await controller.createGlobal(dto);
    expect(res).toEqual({ id: 'g', name: 'G' });
     
    expect(service.createGlobal).toHaveBeenCalledWith(dto);
  });

  it('findAll', async () => {
    type FindAllReturn = Awaited<
      ReturnType<TemplateWorkoutsService['findAll']>
    >;
    service.findAll.mockResolvedValue([
      { id: '1' },
    ] as unknown as FindAllReturn);
    const res = await controller.findAll(user);
    expect(res).toEqual([{ id: '1' }]);
     
    expect(service.findAll).toHaveBeenCalledWith(user.id);
  });

  it('findOne', async () => {
    type FindOneReturn = Awaited<
      ReturnType<TemplateWorkoutsService['findOne']>
    >;
    service.findOne.mockResolvedValue({ id: '1' } as unknown as FindOneReturn);
    const res = await controller.findOne('1', admin);
    expect(res).toEqual({ id: '1' });
     
    expect(service.findOne).toHaveBeenCalledWith('1', admin.id, admin.role);
  });

  it('update', async () => {
    service.update.mockResolvedValue({
      id: '1',
      name: 'B',
    } as unknown as TemplateWorkout);
    const dto: UpdateTemplateWorkoutDto = { name: 'B' };
    const res = await controller.update('1', dto, admin);
    expect(res).toEqual({ id: '1', name: 'B' });
     
    expect(service.update).toHaveBeenCalledWith('1', admin.id, dto, admin.role);
  });

  it('remove', async () => {
    service.remove.mockResolvedValue(undefined);
    await controller.remove('1', user);
     
    expect(service.remove).toHaveBeenCalledWith('1', user.id, user.role);
  });

  it('addExercise', async () => {
    service.addExercise.mockResolvedValue({
      id: 'e1',
    } as unknown as TemplateExercise);
    const dto: CreateTemplateExerciseDto = { exerciseId: 3, position: 1 };
    const res = await controller.addExercise('1', dto, user);
    expect(res).toEqual({ id: 'e1' });
     
    expect(service.addExercise).toHaveBeenCalledWith(
      '1',
      user.id,
      dto,
      user.role,
    );
  });

  it('getExercises', async () => {
    service.getExercises.mockResolvedValue([
      {
        id: 'ex',
        workoutTemplateId: '1',
        position: 1,
        exerciseId: 2,
        exercise: {
          id: 2,
          name: 'P',
          primaryMuscle: 'Chest',
          default: true,
        } as Exercise,
      } as unknown as TemplateExercise & { exercise: Exercise },
    ]);
    const res = await controller.getExercises(user, '1');
    expect(res[0]).toEqual({
      templateExerciseId: 'ex',
      exerciseId: 2,
      position: 1,
      name: 'P',
      primaryMuscle: 'Chest',
      equipment: undefined,
      isDefault: true,
      description: undefined,
      workoutTemplateId: '1',
    });
     
    expect(service.getExercises).toHaveBeenCalledWith('1', user.id, user.role);
  });

  it('updateExercise', async () => {
    service.updateExercise.mockResolvedValue({
      id: 'ex',
      position: 2,
    } as unknown as TemplateExercise);
    const dto: UpdateTemplateExerciseDto = { position: 2 };
    const res = await controller.updateExercise('1', 'ex', dto, user);
    expect(res).toEqual({ id: 'ex', position: 2 });
     
    expect(service.updateExercise).toHaveBeenCalledWith(
      '1',
      'ex',
      user.id,
      dto,
      user.role,
    );
  });

  it('removeExercise', async () => {
    service.removeExercise.mockResolvedValue(undefined);
    await controller.removeExercise('1', 'ex', admin);
     
    expect(service.removeExercise).toHaveBeenCalledWith(
      '1',
      'ex',
      admin.id,
      admin.role,
    );
  });

  it('addSet', async () => {
    service.addSet.mockResolvedValue({ id: 's1' } as unknown as TemplateSet);
    const dto: CreateTemplateSetDto = { reps: 5, weight: 0, position: 1 };
    const res = await controller.addSet('ex', dto, admin);
    expect(res).toEqual({ id: 's1' });
     
    expect(service.addSet).toHaveBeenCalledWith(
      'ex',
      admin.id,
      dto,
      admin.role,
    );
  });

  it('getSets', async () => {
    service.getSets.mockResolvedValue([
      { id: 's1' },
    ] as unknown as TemplateSet[]);
    const res = await controller.getSets('1', 'ex', user);
    expect(res).toEqual([{ id: 's1' }]);
     
    expect(service.getSets).toHaveBeenCalledWith('ex', '1', user.id, user.role);
  });

  it('updateSet', async () => {
    service.updateSet.mockResolvedValue({
      id: 's1',
      reps: 10,
    } as unknown as TemplateSet);
    const dto: UpdateTemplateSetDto = { reps: 10 };
    const res = await controller.updateSet('s1', user, dto);
    expect(res).toEqual({ id: 's1', reps: 10 });
     
    expect(service.updateSet).toHaveBeenCalledWith(
      's1',
      user.id,
      dto,
      user.role,
    );
  });

  it('removeSet', async () => {
    service.removeSet.mockResolvedValue(undefined);
    await controller.removeSet('s1', user);
     
    expect(service.removeSet).toHaveBeenCalledWith('s1', user.id, user.role);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
