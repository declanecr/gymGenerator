import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Example = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // TODO: extract value from request
    return null;
  },
);
