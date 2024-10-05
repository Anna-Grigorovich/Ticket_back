import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {appConfig} from "./config/app.config";
import {MongooseModule} from "@nestjs/mongoose";
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "node:path";
import {APP_GUARD} from "@nestjs/core";
import {RolesGuard} from "./auth/roles.guard";

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
    UsersModule,
    AuthModule,
    EventsModule,
    TicketsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
