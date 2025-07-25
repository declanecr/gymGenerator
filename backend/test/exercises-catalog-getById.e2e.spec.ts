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

describe('GET /exercises-catalog/:id (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let token: string;
  // Because userId is only here to give context to 'otherUserId'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userId: number;
  let otherUserId: number;
  let defaultId: number;
  let otherCustomId: number;

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
      email: 'byid1@example.com',
      password: 'pass1234',
      name: 'By Id 1',
    });
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'byid1@example.com', password: 'pass1234' });
    token = (loginRes.body as LoginResponse).accessToken;
    const secret = process.env.JWT_SECRET || 'myDefaultSecret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    userId = decoded.id;

    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email: 'byid2@example.com',
      password: 'pass1234',
      name: 'By Id 2',
    });
    const other = await prisma.user.findUnique({
      where: { email: 'byid2@example.com' },
    });
    otherUserId = other!.id;

    const def = await prisma.exercise.create({
      data: { name: 'Pull Up', primaryMuscle: 'Back', default: true },
    });
    defaultId = def.id;

    const otherCustom = await prisma.exercise.create({
      data: {
        name: 'Other Custom',
        primaryMuscle: 'Back',
        default: false,
        userId: otherUserId,
      },
    });
    otherCustomId = otherCustom.id;
  });

  afterAll(async () => {
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('fetching a default exercise', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/exercises-catalog/${defaultId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = res.body as ExerciseResponseDto;
    expect(body.exerciseId).toBe(defaultId);
    expect(body.isDefault).toBe(true);
    expect(body.name).toBe('Pull Up');
  });

  it("rejecting access to another user's custom exercise (403)", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/exercises-catalog/${otherCustomId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('returning 404 for a nonexistent ID', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
