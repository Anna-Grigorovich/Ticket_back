import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema} from "../schemas/event.schema";
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: Event.name, schema:  EventSchema}]),
    ConfigModule,
    UsersModule
  ],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
