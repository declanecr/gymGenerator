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
};

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me') // GET users/me
  getMe(@GetUser() user: JwtUser): UserResponseDto {
    return new UserResponseDto(user);
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
