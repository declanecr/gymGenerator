import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { AuthGuard } from '@nestjs/passport';

class MockAuthGuard { canActivate() { return true; } }

describe('WorkoutsController', () => {
  let controller: WorkoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
      providers: [{ provide: WorkoutsService, useValue: {} }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
