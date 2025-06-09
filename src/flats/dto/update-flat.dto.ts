import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsObject,
  IsOptional,
  IsArray,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  residence: string;

  @IsObject()
  @IsOptional()
  coordinates: { lat: number; lng: number };

  @IsArray()
  @IsOptional()
  tags: { name: string; icon?: string }[];
}
