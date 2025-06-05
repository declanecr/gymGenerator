// exercises.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Query,
  Get,
  Patch,
  ParseIntPipe,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ExercisesCatalogService } from './exercises.service';
import { CreateCustomExerciseDto } from './dto/create-custom-exercise.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { ExerciseResponseDto } from './dto/exercise-response.dto';
import { UpdateCustomExerciseDto } from './dto/update-custom-exercise.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('exercises-catalog')
export class ExercisesCatalogController {
  constructor(private readonly exercisesService: ExercisesCatalogService) {}

  @Post('custom')
  async createCustomExercise(
    @Body() dto: CreateCustomExerciseDto,
    @GetUser() user: User,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exercisesService.createCustomExercise(
      user.id,
      dto,
    );
    return new ExerciseResponseDto(exercise);
  }

  // GET exercises visible to the user (i.e. include custom exercises)
  @Get()
  async getExercises(@Query('custom') custom: string, @GetUser() user: User) {
    const showCustom = custom === 'true';
    return this.exercisesService.getVisibleExercises(user.id, showCustom);
  }

  // PATCH custom exercise
  @Patch('custom/:id')
  async updateExercise(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomExerciseDto,
  ): Promise<ExerciseResponseDto> {
    // Call service with (id, dto, user.id)
    const updated = await this.exercisesService.updateCustomExercise(
      id,
      dto,
      user.id,
    );
    return new ExerciseResponseDto(updated);
  }

  @Delete('custom/:id')
  @HttpCode(204) // Send 204 No Content instead of a JSON message
  async deleteExercise(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.exercisesService.deleteCustomExercise(id, user.id);
  }
}
