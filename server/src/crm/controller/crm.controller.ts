import { Body, Controller, Inject, Logger, Post, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('crm')
export class CrmController {
  private readonly logger = new Logger(CrmController.name);

  constructor(@Inject('CRM_SERVICE') private crmService: ClientProxy) {}

  async onApplicationBootstrap() {
    this.logger.debug('onApplicationBootstrap');

    await this.crmService.connect();
  }

  @Post()
  createCustomer(@Res() res, @Body() data) {
    try {
      this.crmService.send('create-customer', data).subscribe(
        (data) => {
          res.status(200).json(data);
        },
        (error) => {
          res.status(500).json(error);
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
