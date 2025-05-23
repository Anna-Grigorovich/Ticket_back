import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import mongoose from "mongoose";
import {EventDocument} from "./event.schema";
import {PaymentDataDocument, PaymentDataSchema} from "./payment.data";

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({timestamps: true})
export class Ticket {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Event'})
    event: EventDocument;
    @Prop()
    code: string;
    @Prop()
    price: number;
    @Prop()
    serviceFee: number;
    @Prop()
    discount: number;
    @Prop()
    data: string;
    @Prop({default: false})
    scanned: boolean;
    @Prop()
    mail: string;
    @Prop({ type: PaymentDataSchema })
    payment: PaymentDataDocument;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
