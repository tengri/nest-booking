import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsMongoId,
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
}
