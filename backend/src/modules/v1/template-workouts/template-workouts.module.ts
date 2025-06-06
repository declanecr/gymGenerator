import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TemplateWorkoutsService } from './template-workouts.service';
import { TemplateWorkoutsController } from './template-workouts.controller';

@Module({
  imports: [PrismaModule],
  providers: [TemplateWorkoutsService],
  controllers: [TemplateWorkoutsController],
})
export class TemplateWorkoutsModule {}
