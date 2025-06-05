import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface JwtUser {
  id: number;
  email: string;
  role: string;
}

// Extend Express’s Request so that `req.user` is typed
interface RequestWithUser extends Request {
  user: JwtUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // 1) Read roles metadat from handler or class
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      // If no roles are set allow access
      return true;
    }

    // 2) Get the user from request (added by JwtAuthGuard)
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user || !user.role) {
      throw new ForbiddenException('No role found on user');
    }

    // 3) Check if user's role is in the requiredRoles array
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
