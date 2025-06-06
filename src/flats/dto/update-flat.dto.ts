import { IsNumber, IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateFlatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
