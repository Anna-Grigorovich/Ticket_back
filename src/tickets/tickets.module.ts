import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema} from "../schemas/event.schema";
import {Ticket, TicketSchema} from "../schemas/ticket.schema";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: Event.name, schema:  EventSchema}, {name: Ticket.name, schema:  TicketSchema}]),
    UsersModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
