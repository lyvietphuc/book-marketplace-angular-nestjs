import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // thêm dòng này
  // Ungültige Eingaben (z. B. falsche E-Mail, leeres Passwort) -> 400 Bad Request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Query-Parameter (Strings) in Zahlen umwandeln
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
