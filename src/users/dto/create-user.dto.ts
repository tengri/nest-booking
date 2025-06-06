import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../../types';

export class CreateUserDto {
  @IsString({ message: 'Email must be a string' })
  @IsEmail({ allow_display_name: true }, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
