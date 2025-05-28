import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/users-response.dto';
import { Prisma } from 'generated/prisma';

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
    } catch (e: unknown) {
      // 5. Handle unique-constraint violations cleanly
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002' &&
        (e.meta?.target as string[])?.includes('email')
      ) {
        throw new ConflictException('Email already in use');
      }
      throw e;
    }
  }

  // 6. also need to implement a findByEmail() to support login
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
