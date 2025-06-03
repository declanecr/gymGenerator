// exercises.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ExercisesCatalogService } from './exercises.service';
import { CreateCustomExerciseDto } from './dto/create-custom-exercise.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from 'generated/prisma';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('exercises-catalog')
export class ExercisesCatalogController {
  constructor(private readonly exercisesService: ExercisesCatalogService) {
    console.log('ExercisesCatalogController loaded');
  }

  @Post('custom')
  async createCustomExercise(
    @Body() dto: CreateCustomExerciseDto,
    @GetUser() user: User,
  ) {
    return this.exercisesService.createCustomExercise(user.id, dto);
  }
}
