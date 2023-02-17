import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/logger';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.enableCors();
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Bside 13th Team 2')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('bside')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'accesskey',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const port = process.env.PORT || 8000;
  // 전체 versioning 설정
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(port);
  logger.log(`${process.env.NODE_ENV} App Listening at localhost:${port}`);
}
bootstrap();
