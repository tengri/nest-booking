import { IsNotEmpty, IsString } from 'class-validator';
import { FileType } from '../../types';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  type: FileType;
}
