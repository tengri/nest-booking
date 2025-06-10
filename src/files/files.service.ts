import { Injectable } from '@nestjs/common';
import { path as rootPath } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import * as sharp from 'sharp';

console.log('sharp: ', sharp);

class FileOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileOperationError';
  }
}

@Injectable()
export class FilesService {
  constructor() {}

  async processImage(
    buffer: Buffer,
    filePath: string,
  ): Promise<{
    width: number;
    height: number;
  }> {
    return new Promise(async (resolve, reject) => {
      return await sharp(buffer)
        .resize(1024)
        .webp({ quality: 80 })
        .toFile(filePath, (err, info: { width: number; height: number }) => {
          if (err) {
            reject(err);
          } else {
            resolve({ width: info.width, height: info.height });
          }
        });
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; width: number; height: number }> {
    const uploadDir: string = rootPath + '/uploads';

    try {
      await ensureDir(uploadDir);
    } catch (error) {
      console.error('Error creating directory:', error);
      throw new FileOperationError('Failed to create upload directory');
    }

    try {
      const { buffer, originalname } = file;
      const fileName =
        Date.now() + '-' + originalname.replace(/\.[^/.]+$/, '.webp');

      const filePath = `${uploadDir}/${fileName}`;

      const { width, height } = await this.processImage(buffer, filePath);

      const url = `${process.env.UPLOADS_URL}/${fileName}`;

      return { url, width, height };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new FileOperationError('Failed to upload file');
    }
  }
}
