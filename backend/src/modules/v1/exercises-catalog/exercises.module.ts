import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExercisesCatalogController } from './exercises.controller';
import { ExercisesCatalogService } from './exercises.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExercisesCatalogController],
  providers: [ExercisesCatalogService],
})
export class ExercisesCatalogModule {
  constructor() {
    console.log('ExercisesCatalogModule loaded');
  }
}
