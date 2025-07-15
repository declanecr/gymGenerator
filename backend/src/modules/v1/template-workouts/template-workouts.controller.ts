import {
  Body,
  Controller,
  Delete,
  Patch,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { TemplateWorkoutsService } from './template-workouts.service';
import { CreateTemplateWorkoutDto } from './dto/create-template-workout.dto';
import { UpdateTemplateWorkoutDto } from './dto/update-template-workout.dto';
import { CreateTemplateExerciseDto } from './dto/create-template-exercise.dto';
import { UpdateTemplateExerciseDto } from './dto/update-template-exercise.dto';
import { CreateTemplateSetDto } from './dto/create-template-set.dto';
import { UpdateTemplateSetDto } from './dto/update-template-set.dto';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';
import { TemplateWorkoutResponseDto } from './dto/template-workout-reponse.dto';
import { TemplateExerciseResponseDto } from './dto/template-exercise-response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('template-workouts')
export class TemplateWorkoutsController {
  constructor(
    private readonly templateWorkoutsService: TemplateWorkoutsService,
  ) {}

  @Post()
  create(@Body() dto: CreateTemplateWorkoutDto, @GetUser() user: JwtPayload) {
    return this.templateWorkoutsService.create(user.id, dto);
  }

  @Get()
  async findAll(
    @GetUser() user: JwtPayload,
  ): Promise<TemplateWorkoutResponseDto[]> {
    const templateWorkouts = await this.templateWorkoutsService.findAll(
      user.id,
    );
    return templateWorkouts.map((w) => new TemplateWorkoutResponseDto(w));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.templateWorkoutsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateWorkoutDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.templateWorkoutsService.update(id, user.id, dto, user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.templateWorkoutsService.remove(id, user.id, user.role);
  }

  // ----- Template Exercise -----
  @Post(':id/exercises')
  addExercise(
    @Param('id') id: string,
    @Body() dto: CreateTemplateExerciseDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.templateWorkoutsService.addExercise(id, user.id, dto);
  }

  @Get(':id/exercises')
  async getExercises(
    @GetUser() user: JwtPayload,
    @Param('id') templateWorkoutId: string,
  ): Promise<TemplateExerciseResponseDto[]> {
    const res = await this.templateWorkoutsService.getExercises(
      templateWorkoutId,
      user.id,
    );
    console.log('fetchTemplateExercises: ', res);
    return res.map((ex) => ({
      templateExerciseId: ex.id,
      exerciseId: ex.exerciseId,
      position: ex.position,
      name: ex.exercise.name,
      primaryMuscle: ex.exercise.primaryMuscle,
      equipment: ex.exercise.equipment,
      isDefault: ex.exercise.default,
      description: ex.exercise.description,
      workoutTemplateId: ex.workoutTemplateId,
    }));
  }

  @Patch(':id/exercises/:eid')
  updateExercise(
    @Param('id') id: string,
    @Param('eid') eid: string,
    @Body() dto: UpdateTemplateExerciseDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.templateWorkoutsService.updateExercise(id, eid, user.id, dto);
  }

  @Delete(':id/exercises/:eid')
  removeExercise(
    @Param('id') id: string,
    @Param('eid') eid: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.templateWorkoutsService.removeExercise(id, eid, user.id);
  }

  // ----- Template Set -----
  @Post(':id/exercises/:eid/sets')
  addSet(
    @Param('eid') eid: string,
    @Body() dto: CreateTemplateSetDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.templateWorkoutsService.addSet(eid, user.id, dto);
  }

  @Get(':id/exercises/:eid/sets')
  getSets(
    @Param('id') id: string,
    @Param('eid') eid: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.templateWorkoutsService.getSets(eid, id, user.id);
  }

  @Patch(':id/exercises/:eid/sets/:sid')
  updateSet(
    @Param('sid') sid: string,
    @GetUser() user: JwtPayload,
    @Body() dto: UpdateTemplateSetDto,
  ) {
    return this.templateWorkoutsService.updateSet(sid, user.id, dto);
  }

  @Delete(':id/exercises/:eid/sets/:sid')
  removeSet(@Param('sid') sid: string, @GetUser() user: JwtPayload) {
    return this.templateWorkoutsService.removeSet(sid, user.id);
  }
}
