import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import mongoose from "mongoose";

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({timestamps: true})
export class Ticket {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
    event: Event;
    @Prop()
    code: string;
    @Prop()
    discount: number;
    @Prop()
    data: string;
    @Prop({default: false})
    scanned: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
