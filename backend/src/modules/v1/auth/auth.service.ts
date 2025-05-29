import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    return user; // just added this to temporarily appease the error messages
    //password checking, JWT issueing
  }
}
