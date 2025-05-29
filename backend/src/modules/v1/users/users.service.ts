import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // 6. also need to implement a findByEmail() to support login
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
