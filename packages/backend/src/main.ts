import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';

class CorsIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly origin: string,
  ) {
    super(app);
  }

  override createIOServer(port: number, options?: ServerOptions) {
    return super.createIOServer(port, {
      ...options,
      cors: { origin: this.origin, credentials: true },
    }) as Server;
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new CorsIoAdapter(app, configService.getOrThrow<string>('FRONTEND_URL')));

  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(configService.get<string>('PORT', '3000'));
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
