import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/users-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginUserDto): Promise<{ accessToken: string }> {
    //check if user exists
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    //if user exists, check if password is correct for user
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    //used the same error to prevent giving away which part is incorrect

    //if both -> succeed
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

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
        e instanceof PrismaClientKnownRequestError &&
        e.code === 'P2002' &&
        (e.meta?.target as string[])?.includes('email')
      ) {
        throw new ConflictException('Email already in use');
      }
      throw e;
    }
  }
}
