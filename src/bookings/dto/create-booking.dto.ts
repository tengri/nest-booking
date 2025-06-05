import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsMongoId,
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
}
