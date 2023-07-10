import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT);
}

bootstrap()
  .then(() => {
    logger.log(`Server started on port ${process.env.PORT}`);
  })
  .catch((error) => {
    logger.error(error);
  });
