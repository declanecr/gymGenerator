import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as jwt from 'jsonwebtoken';
import { CreateTemplateExerciseDto } from 'src/modules/v1/template-workouts/dto/create-template-exercise.dto';
import { CreateTemplateSetDto } from 'src/modules/v1/template-workouts/dto/create-template-set.dto';

describe('TemplateWorkouts edge cases (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let token: string;
  let templateId: string;
  let exerciseId: string;
  let setId: string;

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

    const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    const user = await prisma.user.create({
      data: {
        email: 'edge@example.com',
        password: 'pass',
        name: 'Edge',
        role: 'USER',
      },
    });
    token = jwt.sign({ id: user.id, email: user.email, role: 'USER' }, secret);
    const userId = user.id;

    const exercise = await prisma.exercise.create({
      data: { name: 'Push Up', primaryMuscle: 'Chest', default: true },
    });

    const tpl = await prisma.templateWorkout.create({
      data: { name: 'EdgeTpl', userId },
    });
    templateId = tpl.id;

    const tplEx = await prisma.templateExercise.create({
      data: { workoutTemplateId: tpl.id, exerciseId: exercise.id, position: 1 },
    });
    exerciseId = tplEx.id;

    const tplSet = await prisma.templateSet.create({
      data: { templateExerciseId: tplEx.id, reps: 5, weight: 50, position: 1 },
    });
    setId = tplSet.id;
  });

  afterAll(async () => {
    await prisma.templateSet.deleteMany();
    await prisma.templateExercise.deleteMany();
    await prisma.templateWorkout.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('update non existing template returns 404', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/v1/template-workouts/bogus')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'x' });
    expect(res.status).toBe(404);
  });

  it('update non existing exercise returns 404', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/template-workouts/${templateId}/exercises/bogus`)
      .set('Authorization', `Bearer ${token}`)
      .send({ position: 2 });
    expect(res.status).toBe(404);
  });

  it('update non existing set returns 404', async () => {
    const res = await request(app.getHttpServer())
      .patch(
        `/api/v1/template-workouts/${templateId}/exercises/${exerciseId}/sets/bogus`,
      )
      .set('Authorization', `Bearer ${token}`)
      .send({ reps: 9 });
    expect(res.status).toBe(404);
  });

  it('adding duplicate exercise returns 409', async () => {
    const dto: CreateTemplateExerciseDto = {
      exerciseId: 1,
      position: 1,
    };
    const res = await request(app.getHttpServer())
      .post(`/api/v1/template-workouts/${templateId}/exercises`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto);
    expect(res.status).toBe(409);
  });

  it('adding duplicate set returns 409', async () => {
    const dto: CreateTemplateSetDto = {
      reps: 5,
      weight: 50,
      position: 1,
    };
    const res = await request(app.getHttpServer())
      .post(
        `/api/v1/template-workouts/${templateId}/exercises/${exerciseId}/sets`,
      )
      .set('Authorization', `Bearer ${token}`)
      .send(dto);
    expect(res.status).toBe(409);
  });

  it('deleting already deleted set returns 404', async () => {
    await request(app.getHttpServer())
      .delete(
        `/api/v1/template-workouts/${templateId}/exercises/${exerciseId}/sets/${setId}`,
      )
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app.getHttpServer())
      .delete(
        `/api/v1/template-workouts/${templateId}/exercises/${exerciseId}/sets/${setId}`,
      )
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('invalid set data returns 400', async () => {
    const res = await request(app.getHttpServer())
      .post(
        `/api/v1/template-workouts/${templateId}/exercises/${exerciseId}/sets`,
      )
      .set('Authorization', `Bearer ${token}`)
      .send({ reps: 'bad', weight: 10 });
    expect(res.status).toBe(400);
  });
});
