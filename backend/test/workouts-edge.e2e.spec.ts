import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';

interface LoginResponse {
  accessToken: string;
}

describe('Workouts edge cases (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let ownerToken: string;
  let otherToken: string;
  let adminToken: string;
  let workoutId: string;
  let templateId: string;

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

    // owner
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'edgeowner@example.com',
      password: 'pass1234',
      name: 'Owner',
    });
    const ownerLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'edgeowner@example.com', password: 'pass1234' });
    ownerToken = (ownerLogin.body as LoginResponse).accessToken;

    // other user
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'edgeother@example.com',
      password: 'pass1234',
      name: 'Other',
    });
    const otherLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'edgeother@example.com', password: 'pass1234' });
    otherToken = (otherLogin.body as LoginResponse).accessToken;

    // admin
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'edgeadmin@example.com',
      password: 'adminpass',
      name: 'Admin',
    });
    await prisma.user.update({
      where: { email: 'edgeadmin@example.com' },
      data: { role: 'ADMIN' },
    });
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'edgeadmin@example.com', password: 'adminpass' });
    adminToken = (adminLogin.body as LoginResponse).accessToken;

    const ex = await prisma.exercise.create({
      data: { name: 'Edge Ex', primaryMuscle: 'Arms', default: true },
    });

    const workoutRes = await request(app.getHttpServer())
      .post('/api/v1/workouts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Edge W' });
    workoutId = (workoutRes.body as { id: string }).id;

    const tpl = await prisma.templateWorkout.create({
      data: {
        name: 'Big Template',
        userId: null,
        templateExercises: {
          create: Array.from({ length: 11 }, (_, i) => ({
            exerciseId: ex.id,
            position: i + 1,
            sets: { create: [{ reps: 5, weight: 10, position: 1 }] },
          })),
        },
      },
      include: { templateExercises: { include: { sets: true } } },
    });
    templateId = tpl.id;
  });

  afterAll(async () => {
    await prisma.workoutSet.deleteMany();
    await prisma.workoutExercise.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.templateSet.deleteMany();
    await prisma.templateExercise.deleteMany();
    await prisma.templateWorkout.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it("forbids editing another user's workout", async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Hack' });
    expect(res.status).toBe(404);
  });

  it("forbids deleting another user's workout", async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(404);
  });

  it('returns 400 for malformed create DTO', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/workouts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 123 });
    expect(res.status).toBe(400);
  });

  it('copies a large template', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/workouts/from-template/${templateId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(201);
    const id = (res.body as { id: string }).id;
    const exs = await prisma.workoutExercise.findMany({
      where: { workoutId: id },
    });
    expect(exs.length).toBe(11);
  });

  it("admin cannot delete someone else's workout", async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
