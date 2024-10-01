import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Event, EventDocument} from "../schemas/event.schema";
import {Ticket, TicketDocument} from "../schemas/ticket.schema";
import ObjectId = Types.ObjectId;

@Injectable()
export class TicketsService {
  constructor(
      @InjectModel(Event.name) private eventModel: Model<EventDocument>,
      @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>
  ){}

  create(event: ObjectId, code: number, discount: number, data: string) {
    new this.ticketModel({event, code, discount, data}).save()
  }

  findAll(eventId: string) {
    return this.eventModel.findById(new ObjectId(eventId)).populate('tickets').exec()
  }

  findOne(eventId: string, code: number) {
    return this.ticketModel.findOne({code, event: new ObjectId(eventId)}).exec()
  }
}
