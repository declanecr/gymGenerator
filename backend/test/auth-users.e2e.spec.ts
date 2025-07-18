import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UpdateUserDto } from 'src/modules/v1/users/dto/update-user.dto';
import { UserResponseDto } from 'src/modules/v1/users/dto/users-response.dto';

interface LoginResponse {
  accessToken: string;
}

describe('Auth and Users (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let token: string;

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
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('POST /auth/register registers a new user and returns a token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'auth@example.com',
        password: 'pass1234',
        name: 'Auth Tester',
      });

    expect(res.status).toBe(201);
    const body = res.body as LoginResponse;
    expect(body.accessToken).toBeDefined();
    token = body.accessToken;
  });

  it('POST /auth/login returns a token for valid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'auth@example.com', password: 'pass1234' });

    expect(res.status).toBe(201);
    const body = res.body as LoginResponse;
    expect(body.accessToken).toBeDefined();
    token = body.accessToken;
  });

  it('GET /users/me returns profile data', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const body = res.body as UserResponseDto;
    expect(body.email).toBe('auth@example.com');
  });

  it('PATCH /users/me updates the user name', async () => {
    const dto: UpdateUserDto = { name: 'Updated Tester' };
    const res = await request(app.getHttpServer())
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send(dto);

    expect(res.status).toBe(200);
    const body = res.body as UserResponseDto;
    expect(body.name).toBe(dto.name);
  });

  it('DELETE /users/me removes the user', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('GET /users/me after deletion returns 401', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
