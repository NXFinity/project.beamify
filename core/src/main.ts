import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './functions/swagger.function';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
declare const module: any;
const chalk = require('chalk');
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug'],
    snapshot: true,
    cors: {
      origin:
        process.env.SERVER_ENV === 'production'
          ? process.env.ALLOWED_ORIGINS_URL.split(',')
          : process.env.ALLOWED_ORIGINS_LOCAL.split(','),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  });

  const logger = Logger;

  // Get the ConfigService instance
  const configService = app.get(ConfigService);

  // Determine which database is being used
  const isProduction = configService.get('SERVER_ENV') === 'production';
  const database = isProduction
    ? configService.get('POSTGRES_DB')
    : configService.get('POSTGRES_DEV_DB');

  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // V1 PREFIX FOR ALL ROUTES
  const globalPrefix = 'v1';
  app.setGlobalPrefix(globalPrefix);
  if (process.env.SERVER_ENV === 'development') {
    // SWAGGER
    setupSwagger(app);
  }

  // EXPRESS APP
  app.useStaticAssets(join(__dirname, 'web/assets'));
  app.setBaseViewsDir(join(__dirname, 'web'));
  app.setViewEngine('ejs');

  // PORT
  const port = process.env.SERVER_PORT || 3021;
  await app.listen(port);

  const serverEnv = process.env.SERVER_ENV;
  const url =
    serverEnv === 'production'
      ? 'https://api.beamify.me/v1'
      : `http://localhost:${port}/v1`;

  console.log(chalk.greenBright(`Endpoints are running on: ${url}`));

  console.log(chalk.redBright(`Using database: ${database}`));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
void bootstrap();
