import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesCatalogController } from './exercises.controller';
import { ExercisesCatalogService } from './exercises.service';
import { AuthGuard } from '@nestjs/passport';

class MockAuthGuard {
  canActivate() {
    return true;
  }
}

describe('ExercisesCatalogController', () => {
  let controller: ExercisesCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesCatalogController],
      providers: [{ provide: ExercisesCatalogService, useValue: {} }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<ExercisesCatalogController>(
      ExercisesCatalogController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
