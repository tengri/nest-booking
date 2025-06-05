import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFlatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;
}
