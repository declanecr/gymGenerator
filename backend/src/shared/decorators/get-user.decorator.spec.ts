import 'reflect-metadata';
import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { GetUser } from './get-user.decorator';
import { JwtPayload } from '../guards/jwt.strategy';

describe('GetUser decorator', () => {
  it('returns the user from request', () => {
    class Test {
      handler(@GetUser() user: JwtPayload) {
        return user;
      }
    }
    const metadata = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      Test,
      'handler',
    ) as Record<
      string,
      { factory: (data: unknown, ctx: ExecutionContext) => JwtPayload }
    >;
    const firstKey = Object.keys(metadata)[0];
    const factory = metadata[firstKey].factory;

    const user: JwtPayload = { id: 1, email: 'test@example.com' };
    const ctx = {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    } as unknown as ExecutionContext;

    expect(factory(undefined, ctx)).toEqual(user);
  });
});
