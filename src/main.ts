if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const APP_PORT = process.env.APP_PORT || 3000;

  const app = await NestFactory.create(AppModule, {cors: true});
  app.setGlobalPrefix('api');
  await app.listen(APP_PORT, () =>
    console.log(`Application has been started on port ${APP_PORT}`),
  );
}
bootstrap().then();
