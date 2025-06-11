import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  flatId: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
