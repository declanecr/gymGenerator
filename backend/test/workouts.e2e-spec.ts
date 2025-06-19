import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CreateWorkoutExerciseDto } from 'src/modules/v1/workouts/dto/create-workout-exercise.dto';
import { CreateWorkoutSetDto } from 'src/modules/v1/workouts/dto/create-workout-set.dto';
import { UpdateWorkoutSetDto } from 'src/modules/v1/workouts/dto/update-workout-set.dto';
import { WorkoutResponseDto } from 'src/modules/v1/workouts/dto/workout-response.dto';

interface LoginResponse {
  accessToken: string;
}

describe('Workouts (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let token: string;
  let exerciseId: number;
  let workoutId: string;
  let workoutExerciseId: string;
  let workoutSetId: string;

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
      email: 'wtest@example.com',
      password: 'pass1234',
      name: 'Workout Tester',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'wtest@example.com', password: 'pass1234' });

    token = (loginRes.body as LoginResponse).accessToken;

    const exercise = await prisma.exercise.create({
      data: { name: 'Push Up', primaryMuscle: 'Chest', default: true },
    });
    exerciseId = exercise.id;
  });

  afterAll(async () => {
    await prisma.workoutSet.deleteMany();
    await prisma.workoutExercise.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('POST /workouts creates a workout', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'testWorkoutName' });

    expect(res.status).toBe(201);
    const body = res.body as unknown as WorkoutResponseDto;
    expect(body).toHaveProperty('id');
    workoutId = body.id;
  });

  it('POST /workouts/:id/exercises adds exercise', async () => {
    const dto: CreateWorkoutExerciseDto = { exerciseId, position: 1 };
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/${workoutId}/exercises`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto);

    expect(res.status).toBe(201);
    workoutExerciseId = (res.body as { id: string }).id;
    expect(workoutExerciseId).toBeDefined();
  });

  it('POST /workouts/:id/exercises/:eid/sets adds set', async () => {
    const dto: CreateWorkoutSetDto = { reps: 10, weight: 100, position: 1 };
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}/sets`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto);

    expect(res.status).toBe(201);
    workoutSetId = (res.body as { id: string }).id;
    expect(workoutSetId).toBeDefined();
  });

  it('PATCH /workouts/:id/exercises/:eid/sets/:sid updates set', async () => {
    const dto: UpdateWorkoutSetDto = { reps: 12 };
    const res = await request(app.getHttpServer())
      .patch(
        `/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${workoutSetId}`,
      )
      .set('Authorization', `Bearer ${token}`)
      .send(dto);

    expect(res.status).toBe(200);
    expect((res.body as { reps: number }).reps).toBe(12);
  });

  it('GET /workouts lists user workouts', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = res.body as unknown as WorkoutResponseDto[];
    expect(body.length).toBe(1);
    expect(body[0].id).toBe(workoutId);
  });

  it('GET /workouts/:id returns the created workout', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = res.body as unknown as WorkoutResponseDto;
    expect(body.id).toBe(workoutId);
  });

  it('PATCH /workouts/:id updates the workout (no changes)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    const body = res.body as unknown as WorkoutResponseDto;
    expect(body.id).toBe(workoutId);
  });

  it('PATCH /workouts/:id/exercises/:eid updates exercise position', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ position: 2 });

    expect(res.status).toBe(200);
    expect((res.body as { position: number }).position).toBe(2);
  });

  it('DELETE /workouts/:id/exercises/:eid/sets/:sid removes set', async () => {
    const res = await request(app.getHttpServer())
      .delete(
        `/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}/sets/${workoutSetId}`,
      )
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('DELETE /workouts/:id/exercises/:eid removes exercise', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('DELETE /workouts/:id removes workout', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('GET /workouts returns empty array after deletion', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = res.body as unknown as WorkoutResponseDto[];
    expect(body.length).toBe(0);
  });
});
