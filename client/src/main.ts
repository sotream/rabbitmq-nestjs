import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASS');
  const host = configService.get('RABBITMQ_HOST');
  const crmQueueName = configService.get('RABBITMQ_QUEUE_CRM');

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      noAck: false,
      prefetchCount: 20,
      queue: crmQueueName,
      queueOptions: {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: crmQueueName,
        messageTtl: 60000,
      },
    },
  });

  await app.startAllMicroservices();
}

bootstrap()
  .then(() => {
    logger.log('Consumer started');
  })
  .catch((error) => {
    logger.error(error);
  });
