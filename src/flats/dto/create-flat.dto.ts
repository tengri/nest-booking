import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateFlatDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Capacity is required' })
  capacity: number;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsString({ message: 'Residence must be a string' })
  @IsNotEmpty({ message: 'Residence is required' })
  residence: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Floor is required' })
  floor: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Total floors is required' })
  totalFloors: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Area is required' })
  area: number;

  @IsArray({ message: 'Tags must be an array' })
  @IsOptional({ message: 'Tags can be optional' })
  tags: { name: string; icon?: string }[];

  @IsObject({ message: 'Coordinates must be an object' })
  @IsOptional({ message: 'Coordinates can be optional' })
  coordinates: { lat: number; lng: number };
}
