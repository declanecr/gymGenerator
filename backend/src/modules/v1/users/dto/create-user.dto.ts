// This file is for VALIDATING INCOMING DATA when a user is being created
// - this is why decorators like @IsEmail() and @MinLength() are used
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;
}
