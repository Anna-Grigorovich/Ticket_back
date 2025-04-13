import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import mongoose from "mongoose";
import {EventDocument} from "./event.schema";
import {PaymentDataDocument, PaymentDataSchema} from "./payment.data";

export type OrderDocument = HydratedDocument<Order>;

@Schema({timestamps: true})
export class Order {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Event'})
    event: EventDocument;
    @Prop()
    price: number;
    @Prop()
    serviceFee: number;
    @Prop({default: 0})
    providerFee: number;
    @Prop()
    quantity: number;
    @Prop()
    mail: string;
    @Prop({type: Boolean, default: false})
    payed: boolean;
    @Prop({ type: PaymentDataSchema })
    payment: PaymentDataDocument;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
