import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appModule = app.get(AppModule);
  const port = appModule.getListeningPort();

  const logger = new Logger();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  logger.log(`[🚀🚀🚀 Server] Server is running on PORT=${port}`);
}
bootstrap();
