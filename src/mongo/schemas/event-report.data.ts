import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from "mongoose";

@Schema()
export class EventReport {
    @Prop()
    tickets_sell: number;
    @Prop()
    price: number;
    @Prop()
    serviceFee: number;
    @Prop()
    lp_receiver_commission: number;
    @Prop()
    total: number;
}

export const EventReportSchema = SchemaFactory.createForClass(EventReport);
export type EventReportDocument = HydratedDocument<EventReport>