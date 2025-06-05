import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExerciseResponseDto } from 'src/modules/v1/exercises-catalog/dto/exercise-response.dto';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';
import * as jwt from 'jsonwebtoken';

interface LoginResponse {
  accessToken: string;
}

describe('ExercisesCatalog (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let accessToken: string;

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

    // Create + login test user
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'test1@example.com',
      password: 'testpass',
      name: 'TestUser',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test1@example.com', password: 'testpass' });

    // Make sure we got a successful response
    expect(loginRes.status).toBe(201); //201 is used by successful resource creation

    // Extract the JWT
    const { accessToken: tokenFromBody } = loginRes.body as LoginResponse;
    if (!tokenFromBody) {
      throw new Error('Login did not return an accessToken');
    }

    // Assign to our outer-scope variable
    accessToken = tokenFromBody;

    // 2) Decode the token to get userId
    //    Must match the same secret used by your JwtModule/JwtStrategy
    const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    const decoded = jwt.verify(accessToken, secret) as JwtPayload;
    const userId = decoded.id;

    // Seed default exercise
    await prisma.exercise.create({
      data: {
        name: 'Bench Press',
        primaryMuscle: 'Chest',
        default: true,
      },
    });

    // Seed custom exercise
    await prisma.exercise.create({
      data: {
        name: 'Incline Push',
        primaryMuscle: 'Chest',
        default: false,
        userId,
      },
    });
  });

  afterAll(async () => {
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should return default + custom exercises when ?custom=true', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog?custom=true')
      .set('Authorization', `Bearer ${accessToken}`);

    const body = res.body as ExerciseResponseDto[];
    expect(res.status).toBe(200);
    expect(body.length).toBe(2);

    const names = body.map((e) => e.name);
    expect(names).toContain('Bench Press');
    expect(names).toContain('Incline Push');

    body.forEach((e) => {
      expect(e).toHaveProperty('id');
      expect(e).toHaveProperty('name');
      expect(e).toHaveProperty('primaryMuscle');
      expect(e).not.toHaveProperty('userId'); // Thanks to DTO
    });
  });
});
