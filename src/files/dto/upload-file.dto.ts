import { IsNotEmpty, IsString } from 'class-validator';
import { FileType } from 'src/types';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  type: FileType;
}
