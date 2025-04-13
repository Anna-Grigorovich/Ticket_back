import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from "mongoose";

@Schema()
export class EventReport {
    @Prop({ default: 0 })
    tickets_sell: number;
    @Prop({ default: 0 })
    price: number;
    @Prop({ default: 0 })
    serviceFee: number;
    @Prop({ default: 0 })
    lp_receiver_commission: number;
    @Prop({ default: 0 })
    total: number;
}

export const EventReportSchema = SchemaFactory.createForClass(EventReport);
export type EventReportDocument = HydratedDocument<EventReport>