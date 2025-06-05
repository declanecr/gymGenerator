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
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('exercises-catalog')
export class ExercisesCatalogController {
  constructor(private readonly exercisesService: ExercisesCatalogService) {}

  /** ADMIN ONLY: Create a new default (global) exercise */
  @Post('default')
  @Roles('ADMIN')
  async createDefaultExercise(
    @Body() dto: CreateCustomExerciseDto, // same DTO fields but will be forced to default=true
  ): Promise<ExerciseResponseDto> {
    // Note: service logic will have to set `default: true` and userId: null
    const raw = await this.exercisesService.createDefaultExercise(dto);
    return new ExerciseResponseDto(raw);
  }

  //**NOTE Search must come BEFORE :id, or Nest will try to parse 'search' as a number*/
  // GET /exercises-catalog/search?term=foo
  @Get('search')
  async searchExercises(
    @Query('term') term: string,
    @GetUser() user: User,
  ): Promise<ExerciseResponseDto[]> {
    // Supply `term` to service and map results to DTO
    const raws = await this.exercisesService.searchExercises(term, user);
    return raws.map((e) => new ExerciseResponseDto(e));
  }

  // Get exercise by ID
  @Get(':id')
  async getExerciseById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exercisesService.getById(id, user);
    return new ExerciseResponseDto(exercise);
  }

  // Create custom exercise
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
