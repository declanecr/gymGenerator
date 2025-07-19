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
import { ExerciseResponseDto } from 'src/modules/v1/exercises-catalog/dto/exercise-response.dto';
import { UpdateWorkoutExerciseDto } from 'src/modules/v1/workouts/dto/update-workout-exercise.dto';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';
import * as jwt from 'jsonwebtoken';

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
  let templateId: string;
  let copiedWorkoutId: string;

  let globalTplId: string;
  let userTplId: string;

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
      data: {
        name: 'Push Up',
        primaryMuscle: 'Chest',
        default: true,
        description: 'Do a push up',
        equipment: 'Bodyweight',
      },
    });
    exerciseId = exercise.id;

    const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const userId = decoded.id;

    const tpl = await prisma.templateWorkout.create({
      data: { name: 'Tpl', notes: 'N', userId },
    });
    const tplEx = await prisma.templateExercise.create({
      data: { workoutTemplateId: tpl.id, exerciseId, position: 1 },
    });
    await prisma.templateSet.create({
      data: { templateExerciseId: tplEx.id, reps: 5, weight: 50, position: 1 },
    });
    templateId = tpl.id;

    // 1️⃣ Global template
    const globalTpl = await prisma.templateWorkout.create({
      data: {
        name: 'Global Template',
        userId: null,
        templateExercises: {
          create: [
            {
              exerciseId, // instead of `exercise: { connect: ... }`
              position: 1,
              sets: {
                // instead of `templateSets`
                create: [{ reps: 5, weight: 100, position: 1 }],
              },
            },
          ],
        },
      },
      include: {
        templateExercises: {
          include: { sets: true },
        },
      },
    });
    globalTplId = globalTpl.id;

    // 2️⃣ User-owned template (reuse the same shape, but with `userId`)
    const userTpl = await prisma.templateWorkout.create({
      data: {
        name: 'My Template',
        userId, // from your decoded token
        templateExercises: {
          create: [
            {
              exerciseId,
              position: 1,
              sets: {
                create: [{ reps: 8, weight: 80, position: 1 }],
              },
            },
          ],
        },
      },
      include: {
        templateExercises: {
          include: { sets: true },
        },
      },
    });
    userTplId = userTpl.id;
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

  it('GET /workouts lists user workouts', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = res.body as unknown as WorkoutResponseDto[];
    expect(body.length).toBe(1);
    expect(body[0].id).toBe(workoutId);
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

  it('POST /workouts/from-template/:id copies template', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/from-template/${templateId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    copiedWorkoutId = (res.body as { id: string }).id;

    const exs = await prisma.workoutExercise.findMany({
      where: { workoutId: copiedWorkoutId },
    });
    expect(exs.length).toBe(1);
    const sets = await prisma.workoutSet.findMany({
      where: { workoutExerciseId: exs[0].id },
    });
    expect(sets.length).toBe(1);
  });

  it('PATCH /workouts/:id/exercises/:eid updates exercise', async () => {
    const dto: UpdateWorkoutExerciseDto = { position: 2 };
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/workouts/${workoutId}/exercises/${workoutExerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto);
    expect(res.status).toBe(200);
  });

  it('GET /workouts/:id/exercises fetches exercises', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/workouts/${workoutId}/exercises`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = res.body as ExerciseResponseDto[];
    expect(body.length).toBe(1);
    expect(body[0].name).toBe('Push Up');
    expect(body[0].isDefault).toBe(true);
    expect(body[0].description).toBe('Do a push up');
    expect(body[0].equipment).toBe('Bodyweight');
    expect(body[0]).not.toHaveProperty('userId'); // DTO shields this
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

  it('DELETE copied workout', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/workouts/${copiedWorkoutId}`)
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

  it('POST /workouts/from-template/:id copies template with nested data', async () => {
    // Arrange: you've already created `templateId` in beforeAll
    // Act:
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/from-template/${templateId}`)
      .set('Authorization', `Bearer ${token}`);

    // Assert basic shape:
    expect(res.status).toBe(201);
    const body = res.body as WorkoutResponseDto;
    expect(body).toHaveProperty('id');
    expect(body.workoutTemplateId).toBe(templateId);

    // Assert nested creations:
    const exercises = await prisma.workoutExercise.findMany({
      where: { workoutId: body.id },
    });
    expect(exercises).toHaveLength(1); // you seeded 1 ex
    const sets = await prisma.workoutSet.findMany({
      where: { workoutExerciseId: exercises[0].id },
    });
    expect(sets).toHaveLength(1); // you seeded 1 set
  });

  it('POST /workouts/from-template/:id copies a global template', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/from-template/${globalTplId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    const body = res.body as WorkoutResponseDto;
    expect(body.workoutTemplateId).toBe(globalTplId);
    expect(body).toHaveProperty('id');

    // 🔍 Verify nested workoutExercises + workoutSets got created:
    const wEx = await prisma.workoutExercise.findMany({
      where: { workoutId: body.id },
    });
    expect(wEx).toHaveLength(1);
    const wSets = await prisma.workoutSet.findMany({
      where: { workoutExerciseId: wEx[0].id },
    });
    expect(wSets).toHaveLength(1);
  });

  it('POST /workouts/from-template/:id copies a user-owned template', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/from-template/${userTplId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    const body = res.body as WorkoutResponseDto;
    expect(body.workoutTemplateId).toBe(userTplId);

    // Again, check nested creations:
    const wEx = await prisma.workoutExercise.findMany({
      where: { workoutId: body.id },
    });
    expect(wEx).toHaveLength(1);
    const wSets = await prisma.workoutSet.findMany({
      where: { workoutExerciseId: wEx[0].id },
    });
    expect(wSets).toHaveLength(1);
  });

  it('returns 404 when the template does not exist', async () => {
    const fakeId = 'no-such-tpl';
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/from-template/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body); //.toMatch(/Template not found/);
  });
});
