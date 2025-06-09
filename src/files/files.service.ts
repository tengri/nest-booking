import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { path as rootPath } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

class FileOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileOperationError';
  }
}

@Injectable()
export class FilesService {
  constructor() {}

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    const uploadDir: string = rootPath + '/uploads';

    try {
      await ensureDir(uploadDir);
    } catch {
      throw new FileOperationError('Failed to create upload directory');
    }

    try {
      const { buffer, originalname } = file;
      const fileName = nanoid() + '-' + originalname;
      const filePath = `${uploadDir}/${fileName}`;
      await writeFile(filePath, buffer);

      const url = `${process.env.UPLOADS_URL}/${fileName}`;

      return { url };
    } catch {
      throw new FileOperationError('Failed to upload file');
    }
  }
}
