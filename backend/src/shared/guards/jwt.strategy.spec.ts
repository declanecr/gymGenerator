import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  createMockPrismaService,
  MockedPrismaService,
} from '../../../test/utils/createMockPrismaService';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let prisma: MockedPrismaService;

  beforeEach(() => {
    prisma = createMockPrismaService();
    jwtStrategy = new JwtStrategy(prisma);
  });

  it('should create and then validate user', async () => {
    const newUser = {
      id: 1,
      email: 'test@example.com',
      password: 'testPassword',
      name: 'testUser',
      createdAt: new Date(),
      role: Role.USER,
    };

    prisma.user.create.mockResolvedValue(newUser);
    prisma.user.findUnique.mockResolvedValue(newUser);

    // Simulate creating a user (for example, if you call authService.register)
    const createdUser = await prisma.user.create({
      data: { email: 'test@example.com', password: 'hashedpassword' },
    });

    expect(createdUser).toEqual(newUser);

    // Then validate using JwtStrategy
    const result = await jwtStrategy.validate({
      id: 1,
      email: 'test@example.com',
    });

    expect(result).toEqual(newUser);
    // eslint-disable-next-line @typescript-eslint/unbound-method -- BECAUSE jest-mock-extended mocks are safe to use directly because they're already wrapped
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true, email: true, role: true },
    });
  });

  it('should throw UnauthorizedException if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      jwtStrategy.validate({ id: 999, email: 'ghost@example.com' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
