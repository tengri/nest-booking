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
import { FlatService } from '../flats/flats.service';

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
  ): Promise<{ url: string; width: number; height: number }> {
    const { url, width, height } = await this.filesService.uploadFile(file);

    await this.flatsService.addFile({
      flatId,
      url,
      width,
      height,
      type: uploadFileDto.type,
      originalName: file.originalname,
    });

    return { url, width, height };
  }
}
