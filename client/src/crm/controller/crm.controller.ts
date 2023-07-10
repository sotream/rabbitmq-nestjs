import { Inject, Logger } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

export class CrmController {
  private readonly logger = new Logger(CrmController.name);
  private counter = 0;

  constructor(@Inject('CRM_SERVICE') private crmService: ClientProxy) {}

  @MessagePattern('create-customer')
  createCustomer(@Payload() data: any, @Ctx() context: RmqContext) {
    ++this.counter;
    const originalMsg = context.getMessage();
    const channel = context.getChannelRef();

    try {
      channel.ack(originalMsg);

      return data;
    } catch (error) {
      setTimeout(() => {
        channel.reject(originalMsg);
      }, 5000);

      this.logger.error(error);

      return {
        error: {
          errorCode: 500,
          errorMessage: error.message,
        },
      };
    }
  }
}
