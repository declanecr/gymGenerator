import {
  Get,
  Body,
  Controller,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { UserResponseDto } from './dto/users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type JwtUser = {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;
  role: string;
};

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me') // GET users/me
  async getMe(@GetUser() user: JwtUser): Promise<UserResponseDto> {
    const full = await this.usersService.findById(user.id);
    return new UserResponseDto(full!);
  }

  @Patch('me') // PATCH users/me
  updateMe(
    @GetUser() user: JwtUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(user.id, dto);
  }

  @Delete('me')
  async deleteMe(@GetUser() user: JwtUser): Promise<{ message: string }> {
    await this.usersService.delete(user.id);
    return { message: 'User deleted' };
  }
}
