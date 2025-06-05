import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Role } from '../../types';

export class UpdateUserDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(8)
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
