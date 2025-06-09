import {
  Controller,
  Body,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ValidationPipe } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { FlatService } from 'src/flats/flats.service';

@Controller('flats/:flatId/files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly flatsService: FlatService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('flatId') flatId: string,
  ) {
    const fileUrl = await this.filesService.uploadFile(file);

    await this.flatsService.addFile(
      flatId,
      fileUrl.url,
      uploadFileDto.type,
      file.originalname,
    );

    return fileUrl;
  }
}
