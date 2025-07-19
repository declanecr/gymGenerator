import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesCatalogService } from './exercises.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ExercisesCatalogService', () => {
  let service: ExercisesCatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExercisesCatalogService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ExercisesCatalogService>(ExercisesCatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
