import { Test, TestingModule } from '@nestjs/testing';
import { TemplateWorkoutsController } from './template-workouts.controller';
import { TemplateWorkoutsService } from './template-workouts.service';

describe('TemplateWorkoutsController', () => {
  let controller: TemplateWorkoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateWorkoutsController],
      providers: [{ provide: TemplateWorkoutsService, useValue: {} }],
    }).compile();

    controller = module.get<TemplateWorkoutsController>(TemplateWorkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
