import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  function createContext(user?: {
    id: number;
    email: string;
    role?: string;
  }): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
  }

  it('returns true when no roles are required', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const result = guard.canActivate(
      createContext({ id: 1, email: 'a', role: 'USER' }),
    );
    expect(result).toBe(true);
  });

  it('allows access when user role matches', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const result = guard.canActivate(
      createContext({ id: 1, email: 'a', role: 'ADMIN' }),
    );
    expect(result).toBe(true);
  });

  it('throws when user role missing', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(() =>
      guard.canActivate(createContext({ id: 1, email: 'a' })),
    ).toThrow(ForbiddenException);
  });

  it('throws when role does not match', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(() =>
      guard.canActivate(createContext({ id: 1, email: 'a', role: 'USER' })),
    ).toThrow(ForbiddenException);
  });
});
