import { Test, TestingModule } from '@nestjs/testing';
import { TemplateWorkoutsService } from './template-workouts.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('TemplateWorkoutsService', () => {
  let service: TemplateWorkoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateWorkoutsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<TemplateWorkoutsService>(TemplateWorkoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
