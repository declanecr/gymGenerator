import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExerciseResponseDto } from 'src/modules/v1/exercises-catalog/dto/exercise-response.dto';
import { JwtPayload } from 'src/shared/guards/jwt.strategy';
import * as jwt from 'jsonwebtoken';
import { CreateCustomExerciseDto } from 'src/modules/v1/exercises-catalog/dto/create-custom-exercise.dto';
import { UpdateCustomExerciseDto } from 'src/modules/v1/exercises-catalog/dto/update-custom-exercise.dto';

interface LoginResponse {
  accessToken: string;
}

describe('ExercisesCatalog (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let seededCustomId: number;

  beforeAll(async () => {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

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

    const seeded = await prisma.exercise.create({
      data: {
        name: 'Flat Dumbbell Fly',
        primaryMuscle: 'Chest',
        default: false,
        userId,
      },
    });
    // keep track of seeded.id for your PATCH route
    seededCustomId = seeded.id;
  });

  afterAll(async () => {
    // Clean up both exercises and users, then close Nest
    await prisma.exercise.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('GET /exercises-catalog?custom=false  should return only the default exercise', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog?custom=false')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    const body = res.body as ExerciseResponseDto[];
    // Only “Bench Press” exists so far:
    expect(body.length).toBe(1);
    expect(body[0].name).toBe('Bench Press');
    expect(body[0].isDefault).toBe(true);
    expect(body[0]).not.toHaveProperty('userId'); // DTO shields this
  });

  it('GET /exercises-catalog?custom=true  should return only the default exercise and the seeded custom exercise', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog?custom=true')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    const body = res.body as ExerciseResponseDto[];

    expect(body.length).toBe(2);
    expect(body[0].name).toBe('Flat Dumbbell Fly');
    expect(body[0].isDefault).toBe(false);
    expect(body[0]).not.toHaveProperty('userId'); //DTO shields this

    expect(body[1].name).toBe('Bench Press');
    expect(body[1].isDefault).toBe(true);
    expect(body[1]).not.toHaveProperty('userId'); // DTO shields this
  });

  it('POST /exercises-catalog/custom should create a new custom exercise', async () => {
    // 1) Build a valid CreateCustomExerciseDto
    const dto: CreateCustomExerciseDto = {
      name: 'Incline Push', // any name not colliding with “Bench Press”
      primaryMuscle: 'Chest',
      equipment: 'Dumbbell',
      description: 'A custom incline press variation',
    };

    // 2) Send POST + JWT header
    const postRes = await request(app.getHttpServer())
      .post('/api/v1/exercises-catalog/custom')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto);

    // The server should respond with 201 (created) and return the new record
    expect(postRes.status).toBe(201);

    // Check that response body matches ExerciseResponse shape
    const created = postRes.body as ExerciseResponseDto;
    expect(created).toHaveProperty('exerciseId');
    expect(created.name).toBe(dto.name);
    expect(created.primaryMuscle).toBe(dto.primaryMuscle);
    expect(created.equipment).toBe(dto.equipment);
    expect(created.isDefault).toBe(false);
    expect(created).not.toHaveProperty('userId');

    // 3) (Optional) Verify via GET that two exercises now exist
    const getRes = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog?custom=true')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getRes.status).toBe(200);
    const all = getRes.body as ExerciseResponseDto[];
    // Now “Bench Press” + “Incline Push” should both appear
    const names = all.map((e) => e.name);
    expect(names).toContain('Bench Press');
    expect(names).toContain('Incline Push');
    expect(names).toContain('Flat Dumbbell Fly');
    expect(all.length).toBe(3);
  });

  it('POST /exercises-catalog/custom with a duplicate default name should return 409', async () => {
    // Attempt to create a custom with name “Bench Press” (already default)
    const conflictDto: CreateCustomExerciseDto = {
      name: 'Bench Press',
      primaryMuscle: 'Chest',
      description: 'Trying to collide with default',
    };
    const conflictRes = await request(app.getHttpServer())
      .post('/api/v1/exercises-catalog/custom')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(conflictDto);

    expect(conflictRes.status).toBe(409);
    // (Optional) check error message
    //expect(conflictRes.body.message).toMatch(/reserved by a default exercise/i);
  });

  it('PATCH /exercises-catalog/custom/id should update custom fields', async () => {
    const updateDto: UpdateCustomExerciseDto = {
      name: 'Flat Dumbbell Fly - Modified',
    };

    const patchRes = await request(app.getHttpServer())
      .patch(`/api/v1/exercises-catalog/custom/${seededCustomId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateDto);

    expect(patchRes.status).toBe(200);
    const updated = patchRes.body as ExerciseResponseDto;
    expect(updated.exerciseId).toBe(seededCustomId);
    expect(updated.name).toBe(updateDto.name);
  });

  it('PATCH /…/:id renaming to a default name should return 409', async () => {
    const conflictDto = { name: 'Bench Press' };

    const conflictRes = await request(app.getHttpServer())
      .patch(`/api/v1/exercises-catalog/custom/${seededCustomId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(conflictDto);

    expect(conflictRes.status).toBe(409);
  });

  it('DELETE /exercises-catalog/custom/:id should remove that exercise', async () => {
    // 1) Ensure it exists
    const allBefore = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog?custom=true')
      .set('Authorization', `Bearer ${accessToken}`);

    const allBeforeRes = allBefore.body as ExerciseResponseDto[];

    expect(allBeforeRes.some((e) => e.exerciseId === seededCustomId)).toBe(
      true,
    );

    // 2) Delete it
    const delRes = await request(app.getHttpServer())
      .delete(`/api/v1/exercises-catalog/custom/${seededCustomId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(delRes.status).toBe(204); // or 200, depending on your controller

    // 3) Verify it’s gone
    const allAfter = await request(app.getHttpServer())
      .get('/api/v1/exercises-catalog?custom=true')
      .set('Authorization', `Bearer ${accessToken}`);

    const allAfterRes = allAfter.body as ExerciseResponseDto[];
    expect(allAfterRes.some((e) => e.exerciseId === seededCustomId)).toBe(
      false,
    );
  });
});
