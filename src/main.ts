import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())

  const PORT = process.env.APP_PORT || 8000
  await app.listen(PORT, () => {
    Logger.log(`Nest application running on http://localhost:${PORT}`)
  });
}
bootstrap();
