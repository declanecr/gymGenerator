import 'reflect-metadata';
import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles decorator', () => {
  it('attaches roles metadata', () => {
    class Test {
      @Roles('ADMIN', 'USER')
      handler(this: void) {}
    }

    const roles = Reflect.getMetadata(
      ROLES_KEY,
      Test.prototype.handler,
    ) as string[];
    expect(roles).toEqual(['ADMIN', 'USER']);
  });
});
