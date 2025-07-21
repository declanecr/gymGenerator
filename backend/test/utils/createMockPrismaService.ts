import { PrismaService } from 'src/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockedPrismaService = DeepMockProxy<PrismaService>;

export function createMockPrismaService(): MockedPrismaService {
  return mockDeep<PrismaService>();
}
