#backend #auth #issue #auth 

# Original Code:
```ts
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/users-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  
  // 1. Add a create() that hashes before saving:
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name } = dto;

    // 2. Pick salt rounds -- chosing 12 for a little extra security
    const SALT_ROUNDS = 12;
    const hashed: string = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      // 3. Use Prisma to persist the user with the hashed password
      // creates a new user in the DB with a hashed password
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
        },
      });
  
      // 4. strip the password before returning to the CLIENT
      // user already got saved to DB above, this is to ensure
      // the password isn't returned to the CLIENT
      return new UserResponseDto(user);
    } catch (e: any) {
      // 5. Handle unique-constraint violations cleanly
      if (typeof e === 'object' && e !== null && 'code' in e) {
        if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
          throw new ConflictException('Email already in use');
        }
      }
      throw e;
    }
  }

  // 6. also need to implement a findByEmail() to support login
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```
---
# Issue:
### error producing code
```ts
catch (e: any) {
  if (typeof e === 'object' && e !== null && 'code' in e) {
    if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
      throw new ConflictException('Email already in use');
    }
  }
  throw e;
}
```
This works at runtime, but ESLint still thinks `e.code` and `e.meta` are "unsafe" because TypeScript can't guarantee their existence on every `object`.

---
# Best Practice for Prisma Error Handling
### **Step 1: Use `instanceof` with Prisma's error class**

Prisma provides error classes such as `Prisma.PrismaClientKnownRequestError`.  
Import the class at the top of your file:

``` ts
import { Prisma } from 'generated/prisma';
```

### **Step 2: Narrow with `instanceof`**

Replace your `catch` block with this:
```ts
catch (e: unknown) {
  if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === 'P2002' &&
    (e.meta?.target as string[])?.includes('email')
  ) {
    throw new ConflictException('Email already in use');
  }
  throw e;
}
```

- `instanceof` is safe and recognized by TypeScript/ESLint.
    
- You no longer need `any` or unsafe property access.
---

| **What you used**            | **What you should use**                             |
| ---------------------------- | --------------------------------------------------- |
| `catch (e: any)`             | `catch (e: unknown)`                                |
| `typeof e === 'object'` etc. | `e instanceof Prisma.PrismaClientKnownRequestError` |

---
