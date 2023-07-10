import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrmModule } from './crm/crm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.rabbitmq.${process.env.NODE_ENV}`],
    }),
    CrmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
