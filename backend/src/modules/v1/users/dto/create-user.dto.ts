import { IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  email: string;

  @IsString()
  @Length(8)
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  name: string;
}
