/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CreateWorkoutExerciseDto } from 'src/modules/v1/workouts/dto/create-workout-exercise.dto';
import { CreateWorkoutSetDto } from 'src/modules/v1/workouts/dto/create-workout-set.dto';

interface LoginResponse {
  accessToken: string;
}

describe('Workout sets retrieval (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let tokenOwner: string;
  let tokenOther: string;
  let workoutId: string;
  let workoutExerciseId: string;
  let setId: string;
  let exerciseId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'owner@example.com',
      password: 'pass1234',
      name: 'Owner',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'owner@example.com', password: 'pass1234' });
    tokenOwner = (loginRes.body as LoginResponse).accessToken;

    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'other@example.com',
      password: 'pass1234',
      name: 'Other',
    });
    const loginRes2 = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'other@example.com', password: 'pass1234' });
    tokenOther = (loginRes2.body as LoginResponse).accessToken;

    const ex = await prisma.exercise.create({
      data: { name: 'Pull Up', primaryMuscle: 'Back', default: true },
    });
    exerciseId = ex.id;

    const wRes = await request(app.getHttpServer())
      .post('/api/v1/workouts')
      .set('Authorization', `Bearer ${tokenOwner}`)
      .send({ name: 'Back Day' });
    workoutId = (wRes.body as { id: string }).id;

    const addExRes = await request(app.getHttpServer())
      .post(`/api/v1/workouts/${workoutId}/exercises`)
      .set('Authorization', `Bearer ${tokenOwner}`)
      .send({ exerciseId, position: 1 } as CreateWorkoutExerciseDto);
    workoutExerciseId = (addExRes.body as { id: string }).id;

    const addSetRes = await request(app.getHttpServer())
      .post(`/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`)
      .set('Authorization', `Bearer ${tokenOwner}`)
      .send({ reps: 8, weight: 50, position: 1 } as CreateWorkoutSetDto);
    setId = (addSetRes.body as { id: string }).id;
  });

  afterAll(async () => {
    await prisma.workoutSet.deleteMany();
    await prisma.workoutExercise.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('returns sets for the owner', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`)
      .set('Authorization', `Bearer ${tokenOwner}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(setId);
  });

  it('forbids access for another user', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`)
      .set('Authorization', `Bearer ${tokenOther}`);

    expect(res.status).toBe(403);
  });
});
