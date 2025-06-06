import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';
import * as jwt from 'jsonwebtoken';
import { CreateTemplateWorkoutDto } from 'src/modules/v1/template-workouts/dto/create-template-workout.dto';
import { CreateTemplateExerciseDto } from 'src/modules/v1/template-workouts/dto/create-template-exercise.dto';
import { UpdateTemplateSetDto } from 'src/modules/v1/template-workouts/dto/update-template-set.dto';
import { CreateTemplateSetDto } from 'src/modules/v1/template-workouts/dto/create-template-set.dto';

interface LoginResponse {
  accessToken: string;
}

describe('TemplateWorkouts (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let templateId: string;
  let templateExerciseId: string;
  let templateSetId: string;
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
      email: 'template@example.com',
      password: 'testpass',
      name: 'Tester',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'template@example.com', password: 'testpass' });

    accessToken = (loginRes.body as LoginResponse).accessToken;
    const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    const decoded = jwt.verify(accessToken, secret) as JwtPayload;
    const userId = decoded.id;

    const exercise = await prisma.exercise.create({
      data: { name: 'Push Up', primaryMuscle: 'Chest', default: true },
    });
    exerciseId = exercise.id;

    // Cleanup any existing data for this user
    await prisma.templateSet.deleteMany();
    await prisma.templateExercise.deleteMany();
    await prisma.templateWorkout.deleteMany({ where: { userId } });
  });

  afterAll(async () => {
    await prisma.templateSet.deleteMany();
    await prisma.templateExercise.deleteMany();
    await prisma.templateWorkout.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('POST /template-workouts should create a new template', async () => {
    const dto: CreateTemplateWorkoutDto = { name: 'Chest Day', notes: 'push' };
    const res = await request(app.getHttpServer())
      .post('/api/v1/template-workouts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto);
    expect(res.status).toBe(201);
    templateId = (res.body as { id: string }).id;
    expect((res.body as { name: string }).name).toBe(dto.name);
  });

  it('GET /template-workouts should list templates', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/template-workouts')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect((res.body as unknown[]).length).toBe(1);
  });

  it('POST /template-workouts/:id/exercises adds an exercise', async () => {
    const dto: CreateTemplateExerciseDto = { exerciseId };
    const res = await request(app.getHttpServer())
      .post(`/api/v1/template-workouts/${templateId}/exercises`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto);
    expect(res.status).toBe(201);
    templateExerciseId = (res.body as { id: string }).id;
  });

  it('POST /template-workouts/:id/exercises/:eid/sets adds a set', async () => {
    const dto: CreateTemplateSetDto = { reps: 10, weight: 100 };
    const res = await request(app.getHttpServer())
      .post(
        `/api/v1/template-workouts/${templateId}/exercises/${templateExerciseId}/sets`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto);
    expect(res.status).toBe(201);
    templateSetId = (res.body as { id: string }).id;
  });

  it('PATCH /template-workouts/:id/exercises/:eid/sets/:sid updates the set', async () => {
    const dto: UpdateTemplateSetDto = { reps: 12 };
    const res = await request(app.getHttpServer())
      .patch(
        `/api/v1/template-workouts/${templateId}/exercises/${templateExerciseId}/sets/${templateSetId}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto);
    expect(res.status).toBe(200);
    expect((res.body as { reps: number }).reps).toBe(dto.reps);
  });

  it('DELETE /template-workouts/:id/exercises/:eid/sets/:sid removes the set', async () => {
    const res = await request(app.getHttpServer())
      .delete(
        `/api/v1/template-workouts/${templateId}/exercises/${templateExerciseId}/sets/${templateSetId}`,
      )
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it('DELETE /template-workouts/:id/exercises/:eid removes the exercise', async () => {
    const res = await request(app.getHttpServer())
      .delete(
        `/api/v1/template-workouts/${templateId}/exercises/${templateExerciseId}`,
      )
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it('DELETE /template-workouts/:id removes the template', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/template-workouts/${templateId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });
});
