import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class UpdateBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsMongoId()
  @IsNotEmpty()
  flatId: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
