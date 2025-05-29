import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
    /*  if you want to return basic user info as well, try:
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }; */
  }
}
