import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './modules/app.module';
import { urlencoded, json } from 'express';
import { ConfigModule, ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // const configService = app.get(ConfigService);
  // const api_key = configService.get('CLOUDINARY_API_KEY');
  // const api_secret = configService.get('CLOUDINARY_API_SECRET');
  // const api_name = configService.get('CLOUDINARY_NAME');

  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));


  app.enableCors({
    origin: "http://localhost:8080",
    credentials: true,
  });

  
  await app.listen(3000);
}
bootstrap();
