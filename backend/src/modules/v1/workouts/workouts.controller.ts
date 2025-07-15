import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';
import { WorkoutResponseDto } from './dto/workout-response.dto';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { UpdateWorkoutSetDto } from './dto/update-workout-set.dto';
import { WorkoutExerciseResponseDto } from './dto/workout-exercise-response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  async create(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsService.create(user.id, dto);
    return new WorkoutResponseDto(workout);
  }

  @Post('from-template/:tid')
  async createFromTemplate(
    @GetUser() user: JwtPayload,
    @Param('tid') id: string,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsService.copyFromTemplate(id, user.id);
    return new WorkoutResponseDto(workout);
  }

  @Get()
  async findAll(@GetUser() user: JwtPayload): Promise<WorkoutResponseDto[]> {
    const workouts = await this.workoutsService.findAll(user.id);
    return workouts.map((w) => new WorkoutResponseDto(w));
  }

  @Get(':id')
  async findOne(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsService.findOne(id, user.id);
    return new WorkoutResponseDto(workout);
  }

  @Patch(':id')
  async update(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsService.update(id, dto, user.id);
    return new WorkoutResponseDto(workout);
  }

  @Delete(':id')
  async remove(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    await this.workoutsService.remove(id, user.id);
  }

  @Post(':id/exercises')
  async addExercise(
    @GetUser() user: JwtPayload,
    @Param('id') workoutId: string,
    @Body() dto: CreateWorkoutExerciseDto,
  ) {
    return this.workoutsService.addExercise(workoutId, user.id, dto);
  }

  @Get(':id/exercises')
  async fetchExercises(
    @GetUser() user: JwtPayload,
    @Param('id') workoutId: string,
  ): Promise<WorkoutExerciseResponseDto[]> {
    const res = await this.workoutsService.getExercises(workoutId, user.id);
    console.log('fetchExercises: ', res);
    return res.map((ex) => ({
      workoutExerciseId: ex.id,
      exerciseId: ex.exerciseId,
      position: ex.position,
      name: ex.exercise.name,
      primaryMuscle: ex.exercise.primaryMuscle,
      equipment: ex.exercise.equipment,
      isDefault: ex.exercise.default,
      description: ex.exercise.description,
    }));
  }

  @Patch(':id/exercises/:eid')
  async updateExercise(
    @GetUser() user: JwtPayload,
    @Param('id') workoutId: string,
    @Param('eid') exerciseId: string,
    @Body() dto: UpdateWorkoutExerciseDto,
  ) {
    return this.workoutsService.updateExercise(
      workoutId,
      exerciseId,
      user.id,
      dto,
    );
  }

  @Delete(':id/exercises/:eid')
  async removeExercise(
    @GetUser() user: JwtPayload,
    @Param('id') workoutId: string,
    @Param('eid') exerciseId: string,
  ) {
    await this.workoutsService.removeExercise(workoutId, exerciseId, user.id);
  }

  @Post(':id/exercises/:eid/sets')
  async addSet(
    @GetUser() user: JwtPayload,
    @Param('eid') exerciseId: string,
    @Body() dto: CreateWorkoutSetDto,
  ) {
    return this.workoutsService.addSet(exerciseId, user.id, dto);
  }

  @Get(':id/exercises/:eid/sets')
  async getSets(
    @GetUser() user: JwtPayload,
    @Param('eid') exerciseId: string,
    @Param('id') workoutId: string,
  ) {
    console.log(exerciseId, workoutId);
    const res = await this.workoutsService.getSets(
      exerciseId,
      workoutId,
      user.id,
    );
    console.log('getSets: ', res);
    return res;
  }

  @Patch(':id/exercises/:eid/sets/:sid')
  async updateSet(
    @GetUser() user: JwtPayload,
    @Param('sid') setId: string,
    @Body() dto: UpdateWorkoutSetDto,
  ) {
    return this.workoutsService.updateSet(setId, user.id, dto);
  }

  @Delete(':id/exercises/:eid/sets/:sid')
  async removeSet(@GetUser() user: JwtPayload, @Param('sid') setId: string) {
    await this.workoutsService.removeSet(setId, user.id);
  }
}
