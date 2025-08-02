 
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';

interface LoginResponse {
  accessToken: string;
}

describe('Template workout access control (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let otherToken: string;
  let templateId: string;
  let templateExerciseId: string;
  let setId: string;
  let globalTplId: string;

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

    // user
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'tpluser@example.com',
      password: 'testpass',
      name: 'User',
    });
    const userLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'tpluser@example.com', password: 'testpass' });
    userToken = (userLogin.body as LoginResponse).accessToken;
    const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    const decodedUser = jwt.verify(userToken, secret) as JwtPayload;
    const userId = decodedUser.id;

    // second regular user
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'tplother@example.com',
      password: 'testpass',
      name: 'Other',
    });
    const otherLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'tplother@example.com', password: 'testpass' });
    otherToken = (otherLogin.body as LoginResponse).accessToken;

    // admin
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'tpladmin@example.com',
      password: 'adminpass',
      name: 'Admin',
    });
    await prisma.user.update({
      where: { email: 'tpladmin@example.com' },
      data: { role: 'ADMIN' },
    });
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'tpladmin@example.com', password: 'adminpass' });
    adminToken = (adminLogin.body as LoginResponse).accessToken;

    const exercise = await prisma.exercise.create({
      data: { name: 'Sit Up', primaryMuscle: 'Core', default: true },
    });

    const tpl = await prisma.templateWorkout.create({
      data: {
        name: 'My Template',
        userId,
        templateExercises: {
          create: [
            {
              exerciseId: exercise.id,
              position: 1,
              sets: { create: [{ reps: 5, weight: 50, position: 1 }] },
            },
          ],
        },
      },
      include: { templateExercises: { include: { sets: true } } },
    });
    templateId = tpl.id;
    templateExerciseId = tpl.templateExercises[0].id;
    setId = tpl.templateExercises[0].sets[0].id;
  });

  afterAll(async () => {
    await prisma.templateSet.deleteMany();
    await prisma.templateExercise.deleteMany();
    await prisma.templateWorkout.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('Only admins can create global templates', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/template-workouts/global')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Global', notes: 'g' });

    expect(res.status).toBe(201);
    globalTplId = (res.body as { id: string }).id;

    const list = await request(app.getHttpServer())
      .get('/api/v1/template-workouts')
      .set('Authorization', `Bearer ${userToken}`);
    const ids = (list.body as { id: string }[]).map((w) => w.id);
    expect(ids).toContain(globalTplId);
  });

  it('regular user cannot create global template', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/template-workouts/global')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Fail', notes: 'x' });
    expect(res.status).toBe(403);
  });

  it('Owner can fetch template with nested data', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/template-workouts/${templateId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(templateId);
    expect(res.body.templateExercises[0].sets.length).toBe(1);
  });

  it('Admin can fetch another user template', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/template-workouts/${templateId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('Other user cannot fetch template', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/template-workouts/${templateId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(403);
  });

  it('Owner retrieves sets list', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/api/v1/template-workouts/${templateId}/exercises/${templateExerciseId}/sets`,
      )
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(setId);
  });

  it('Admin retrieves sets list', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/api/v1/template-workouts/${templateId}/exercises/${templateExerciseId}/sets`,
      )
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('Other user cannot read sets', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/api/v1/template-workouts/${templateId}/exercises/${templateExerciseId}/sets`,
      )
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(403);
  });
});
