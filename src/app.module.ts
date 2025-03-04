import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {appConfig} from "./config/app.config";
import {MongooseModule} from "@nestjs/mongoose";
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { MongoModule } from './mongo/mongo.module';
import { PaymentModule } from './payment/payment.module';
import * as path from "path";
import {AppLoggerMiddleware} from "./middlewares/app.logger.middleware";
import {ExceptionsFilter} from "./filters/exceptions.filter";
import {APP_FILTER} from "@nestjs/core";
import { OrderModule } from './order/order.module';
import {ScheduleModule} from "@nestjs/schedule";
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: path.join(process.cwd(), configService.get<string>('imagesPath')),
          serveRoot: '/images',
        },
      ],
    }),
    ScheduleModule.forRoot(),
    MongoModule,
    UsersModule,
    AuthModule,
    EventsModule,
    TicketsModule,
    PaymentModule,
    OrderModule,
    ReportModule
  ],
  controllers: [],
  providers: [
    {provide: APP_FILTER, useClass: ExceptionsFilter}
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}