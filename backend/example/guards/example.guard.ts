import { CanActivate, ExecutionContext } from '@nestjs/common';

export class ExampleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // TODO: add guard logic
    return true;
  }
}
