// createParamDecorator is just a NestJS decorator which indicates that you are making a custom decorator
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../guards/jwt.strategy';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.user;
  },
);
