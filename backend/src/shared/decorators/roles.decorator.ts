import { SetMetadata } from '@nestjs/common';

// Key that RolesGuard will read
export const ROLES_KEY = 'roles';

// @Roles('ADMIN', 'USER') → attaches metadata to route
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
