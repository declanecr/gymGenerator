import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesCatalogController } from './exercises.controller';
import { ExercisesCatalogService } from './exercises.service';

describe('ExercisesCatalogController', () => {
  let controller: ExercisesCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesCatalogController],
      providers: [{ provide: ExercisesCatalogService, useValue: {} }],
    }).compile();

    controller = module.get<ExercisesCatalogController>(ExercisesCatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
