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

describe('Admin workouts endpoint (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let userToken: string;
  let adminToken: string;
  let userId: number;
  let adminId: number;

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

    // regular user
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'workuser@example.com',
      password: 'testpass',
      name: 'User',
    });
    const userLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'workuser@example.com', password: 'testpass' });
    userToken = (userLogin.body as LoginResponse).accessToken;
    const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    const decodedUser = jwt.verify(userToken, secret) as JwtPayload;
    userId = decodedUser.id;

    // admin user
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'workadmin@example.com',
      password: 'adminpass',
      name: 'Admin',
    });
    await prisma.user.update({
      where: { email: 'workadmin@example.com' },
      data: { role: 'ADMIN' },
    });
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'workadmin@example.com', password: 'adminpass' });
    adminToken = (adminLogin.body as LoginResponse).accessToken;
    const decodedAdmin = jwt.verify(adminToken, secret) as JwtPayload;
    adminId = decodedAdmin.id;

    // seed workouts
    await prisma.workout.create({ data: { name: 'U1', userId } });
    await prisma.workout.create({ data: { name: 'A1', userId: adminId } });
  });

  afterAll(async () => {
    await prisma.workout.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('Admin sees all workouts', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/workouts/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
     
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('Regular user cannot access admin list', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/workouts/admin')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
