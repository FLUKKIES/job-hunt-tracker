import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ใช้สำหรับการ validate ข้อมูลตามที่กำหนดใน DTO
  app.useGlobalPipes(new ValidationPipe());

  // ใช้สำหรับการใช้ Cookie
  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
