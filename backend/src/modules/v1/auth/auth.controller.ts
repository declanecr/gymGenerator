import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // POST auth/login
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('register') //POST auth/register
  async create(@Body() dto: CreateUserDto) {
    await this.authService.create(dto);
    return this.authService.login({ email: dto.email, password: dto.password });
  }
}
