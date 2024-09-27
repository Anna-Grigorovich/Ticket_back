import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {appConfig} from "./config/app.config";
import {MongooseModule} from "@nestjs/mongoose";
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoConnectURI')
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    TicketsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
