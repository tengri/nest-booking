import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private accountId: string;

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'R2_SECRET_ACCESS_KEY',
    );

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'Missing R2 configuration. Please check your environment variables.',
      );
    }

    this.s3Client = new S3Client({
      region: 'auto', // R2 uses 'auto' region
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || '';
    console.log('Bucket Name:', this.bucketName);
    this.accountId = accountId;

    // Validate bucket name
    if (!this.bucketName) {
      throw new Error('R2_BUCKET_NAME is not set in environment variables');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; width: number; height: number }> {
    try {
      const { buffer, originalname } = file;

      console.log('R2 Upload Debug Info:');
      console.log('Bucket Name:', this.bucketName);
      console.log('Account ID:', this.accountId);
      console.log('File Name:', originalname);

      // Process image with Sharp
      const processedImage = await sharp(buffer)
        .resize(1024)
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `${Date.now()}-${originalname.replace(/\.[^/.]+$/, '.webp')}`;
      const key = `uploads/${fileName}`;

      console.log('Upload Key:', key);

      // Upload to R2
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: processedImage,
        ContentType: 'image/webp',
        ACL: 'public-read',
      });

      console.log('Sending upload command...');
      await this.s3Client.send(uploadCommand);
      console.log('Upload successful!');

      // Get image dimensions
      const metadata = await sharp(processedImage).metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      // Return the public URL for R2
      // For R2, we need to use the correct public URL format
      // The standard R2 public URL format is: https://pub-<hash>.r2.dev/<bucket>/<key>
      const customDomain = this.configService.get<string>('R2_PUBLIC_DOMAIN');
      if (!customDomain) {
        throw new Error('R2_PUBLIC_DOMAIN is not set in environment variables');
      }
      const url = `https://${customDomain}/${key}`;

      console.log('Generated URL:', url);

      return { url, width, height };
    } catch (error) {
      console.error('Error uploading file to R2:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
      throw new Error(`Failed to upload file to R2: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);
    } catch (error) {
      console.error('Error deleting file from R2:', error);
      throw new Error('Failed to delete file from R2');
    }
  }

  async generatePresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
