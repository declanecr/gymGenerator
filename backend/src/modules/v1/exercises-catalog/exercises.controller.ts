// exercises.controller.ts
import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common';
import { ExercisesCatalogService } from './exercises.service';
import { CreateCustomExerciseDto } from './dto/create-custom-exercise.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from '@prisma/client';
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

  // GET exercises visible to the user (i.e. include custom exercises)
  @Get()
  async getExercises(@Query('custom') custom: string, @GetUser() user: User) {
    const showCustom = custom === 'true';
    return this.exercisesService.getVisibleExercises(user.id, showCustom);
  }
}
