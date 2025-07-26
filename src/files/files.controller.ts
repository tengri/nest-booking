import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { ValidationPipe } from '@nestjs/common';
import { UploadFlatFileDto } from './dto/upload-file.dto';
import { FlatService } from '../flats/flats.service';

@Controller('flats/:flatId/files')
export class FilesController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly flatsService: FlatService,
  ) {}

  @UsePipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() uploadFileDto: UploadFlatFileDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('flatId') flatId: string,
  ): Promise<{ url: string; width: number; height: number; success: boolean }> {
    console.log('Upload request received:');
    console.log('File:', file?.originalname, 'Size:', file?.size);
    console.log('DTO:', uploadFileDto);
    console.log('FlatId:', flatId);

    if (!file) {
      throw new Error('No file uploaded');
    }

    try {
      const { url, width, height } = await this.s3Service.uploadFile(file);

      console.log('Upload successful, URL:', url);

      await this.flatsService.addFile({
        flatId,
        url,
        width,
        height,
        type: uploadFileDto.type,
        originalName: file.originalname,
      });

      return { url, width, height, success: true };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  @Post('test-upload')
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<{ message: string; fileInfo: any; body: any }> {
    console.log('Test upload received:');
    console.log('File:', file?.originalname, 'Size:', file?.size);
    console.log('Body:', body);
    
    return {
      message: 'File received successfully',
      fileInfo: {
        originalname: file?.originalname,
        size: file?.size,
        mimetype: file?.mimetype,
      },
      body,
    };
  }

  @Post('test-r2')
  @UseInterceptors(FileInterceptor('file'))
  async testR2Upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; width: number; height: number; success: boolean }> {
    // Test endpoint for R2 upload without saving to database
    const result = await this.s3Service.uploadFile(file);
    return { ...result, success: true };
  }

  @Get('proxy/:filename')
  async proxyImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Construct the R2 URL
      const url = `https://${this.s3Service['accountId']}.r2.cloudflarestorage.com/${this.s3Service['bucketName']}/uploads/${filename}`;
      
      // Fetch the image from R2
      const response = await fetch(url);
      
      if (!response.ok) {
        res.status(404).send('Image not found');
        return;
      }

      // Set appropriate headers
      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      // Get the image buffer and send it
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).send('Error fetching image');
    }
  }
}
