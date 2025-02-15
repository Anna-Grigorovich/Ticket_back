import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {appConfig} from "./config/app.config";
import {MongooseModule} from "@nestjs/mongoose";
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { MongoModule } from './mongo/mongo.module';
import * as path from "path";

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
    MongoModule,
    UsersModule,
    AuthModule,
    EventsModule,
    TicketsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
