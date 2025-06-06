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
import { User } from '@prisma/client';
import { TemplateWorkoutsService } from './template-workouts.service';
import { CreateTemplateWorkoutDto } from './dto/create-template-workout.dto';
import { UpdateTemplateWorkoutDto } from './dto/update-template-workout.dto';
import { CreateTemplateExerciseDto } from './dto/create-template-exercise.dto';
import { UpdateTemplateExerciseDto } from './dto/update-template-exercise.dto';
import { CreateTemplateSetDto } from './dto/create-template-set.dto';
import { UpdateTemplateSetDto } from './dto/update-template-set.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('template-workouts')
export class TemplateWorkoutsController {
  constructor(private readonly svc: TemplateWorkoutsService) {}

  @Post()
  create(@Body() dto: CreateTemplateWorkoutDto, @GetUser() user: User) {
    return this.svc.create(user.id, dto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.svc.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.svc.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateWorkoutDto,
    @GetUser() user: User,
  ) {
    return this.svc.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.svc.remove(id, user.id);
  }

  // ----- Template Exercise -----
  @Post(':id/exercises')
  addExercise(
    @Param('id') id: string,
    @Body() dto: CreateTemplateExerciseDto,
    @GetUser() user: User,
  ) {
    return this.svc.addExercise(id, user.id, dto);
  }

  @Patch(':id/exercises/:eid')
  updateExercise(
    @Param('id') id: string,
    @Param('eid') eid: string,
    @Body() dto: UpdateTemplateExerciseDto,
    @GetUser() user: User,
  ) {
    return this.svc.updateExercise(id, eid, user.id, dto);
  }

  @Delete(':id/exercises/:eid')
  removeExercise(
    @Param('id') id: string,
    @Param('eid') eid: string,
    @GetUser() user: User,
  ) {
    return this.svc.removeExercise(id, eid, user.id);
  }

  // ----- Template Set -----
  @Post(':id/exercises/:eid/sets')
  addSet(
    @Param('eid') eid: string,
    @Body() dto: CreateTemplateSetDto,
    @GetUser() user: User,
  ) {
    return this.svc.addSet(eid, user.id, dto);
  }

  @Patch(':id/exercises/:eid/sets/:sid')
  updateSet(
    @Param('sid') sid: string,
    @GetUser() user: User,
    @Body() dto: UpdateTemplateSetDto,
  ) {
    return this.svc.updateSet(sid, user.id, dto);
  }

  @Delete(':id/exercises/:eid/sets/:sid')
  removeSet(@Param('sid') sid: string, @GetUser() user: User) {
    return this.svc.removeSet(sid, user.id);
  }
}
