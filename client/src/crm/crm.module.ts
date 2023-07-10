import { Module } from '@nestjs/common';
import { CrmController } from './controller/crm.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule],
  controllers: [CrmController],
  providers: [
    {
      provide: 'CRM_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASS');
        const host = configService.get('RABBITMQ_HOST');
        const crmQueueName = configService.get('RABBITMQ_QUEUE_CRM');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: crmQueueName,
            queueOptions: {
              durable: true,
              deadLetterExchange: '',
              deadLetterRoutingKey: crmQueueName,
              messageTtl: 60000,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class CrmModule {}
