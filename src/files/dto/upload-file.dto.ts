import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../types';

export class UploadFlatFileDto {
  @ApiProperty({
    description: 'Type of file being uploaded',
    enum: FileType,
    example: FileType.IMAGE,
  })
  @IsNotEmpty()
  @IsEnum(FileType)
  type: FileType;

  @ApiProperty({
    description: 'ID of the flat to associate the file with',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  flatId: string;
}
