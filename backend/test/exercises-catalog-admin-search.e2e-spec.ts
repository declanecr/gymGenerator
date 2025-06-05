import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExerciseResponseDto } from 'src/modules/v1/exercises-catalog/dto/exercise-response.dto';
import { CreateCustomExerciseDto } from 'src/modules/v1/exercises-catalog/dto/create-custom-exercise.dto';

interface LoginResponse {
  accessToken: string;
}

describe('Catalog search and admin features (e2e)', () => {
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

    // create normal user
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'user@example.com',
      password: 'testpass',
      name: 'User',
    });
    const userLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'testpass' });
    //const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    userToken = (userLogin.body as LoginResponse).accessToken;
    const userRecord = await prisma.user.findUnique({
      where: { email: 'user@example.com' },
    });
    userId = userRecord!.id;

    // create admin user then promote
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'admin@example.com',
      password: 'adminpass',
      name: 'Admin',
    });
    await prisma.user.update({
      where: { email: 'admin@example.com' },
      data: { role: 'ADMIN' },
    });
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpass' });
    adminToken = (adminLogin.body as LoginResponse).accessToken;
    const adminRecord = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });
    adminId = adminRecord!.id;

    // seed default exercise
    await prisma.exercise.create({
      data: { name: 'Bench Press', primaryMuscle: 'Chest', default: true },
    });

    // seed custom exercises
    await prisma.exercise.create({
      data: {
        name: 'Bench Dip',
        primaryMuscle: 'Chest',
        default: false,
        userId,
      },
    });
    await prisma.exercise.create({
      data: {
        name: 'Flat Dumbbell Fly',
        primaryMuscle: 'Chest',
        default: false,
        userId,
      },
    });
    await prisma.exercise.create({
      data: {
        name: 'Cable Fly',
        primaryMuscle: 'Chest',
        default: false,
        userId: adminId,
      },
    });
  });

  afterAll(async () => {
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('GET /api/v1/exercises-catalog/search?term=bench  USER searching "bench" returns default and user custom exercises', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog/search?term=bench')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    const names = (res.body as ExerciseResponseDto[]).map((e) => e.name);
    expect(names).toContain('Bench Press');
    expect(names).toContain('Bench Dip');
    expect(names).not.toContain('Cable Fly');
  });

  it('GET /api/v1/exercises-catalog/search?term=  ADMIN search includes exercises from all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog/search?term=fly')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const names = (res.body as ExerciseResponseDto[]).map((e) => e.name);
    expect(names).toContain('Flat Dumbbell Fly');
    expect(names).toContain('Cable Fly');
  });

  it('GET /api/v1/exercises-catalog/search regular user search excludes others custom exercises', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog/search?term=fly')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    const names = (res.body as ExerciseResponseDto[]).map((e) => e.name);
    expect(names).toContain('Flat Dumbbell Fly');
    expect(names).not.toContain('Cable Fly');
  });

  it('POST /api/v1/exercises-catalog/default non-admin cannot create default exercise', async () => {
    const dto: CreateCustomExerciseDto = {
      name: 'Deadlift',
      primaryMuscle: 'Back',
      description: 'test',
    };
    const res = await request(app.getHttpServer())
      .post('/api/v1/exercises-catalog/default')
      .set('Authorization', `Bearer ${userToken}`)
      .send(dto);

    expect(res.status).toBe(403);
  });

  it('POST /api/v1/exercises-catalog/default admin can create default exercise', async () => {
    const dto: CreateCustomExerciseDto = {
      name: 'Deadlift',
      primaryMuscle: 'Back',
      description: 'Heavy lift',
    };
    const res = await request(app.getHttpServer())
      .post('/api/v1/exercises-catalog/default')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(dto);
    expect(res.status).toBe(201);
    const created = res.body as ExerciseResponseDto;
    expect(created.name).toBe('Deadlift');
    expect(created.isDefault).toBe(true);

    const listRes = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog?custom=false')
      .set('Authorization', `Bearer ${userToken}`);
    const names = (listRes.body as ExerciseResponseDto[]).map((e) => e.name);
    expect(names).toContain('Deadlift');
  });
});
