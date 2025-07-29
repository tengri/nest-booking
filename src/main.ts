import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Aigerus API')
    .setDescription('The Aigerus API description')
    .setVersion('1.0')
    .addTag('aigerus')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors('*');

  // Set body size limit to 50mb
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.set('Content-Length', '52428800'); // 50MB in bytes
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
