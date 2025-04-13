import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {TicketDocument} from "./ticket.schema";
import {EventPriceDocument, EventPriceSchema} from "./event.price";
import {EventReportDocument, EventReportSchema} from "./event-report.data";

@Schema({timestamps: true, toJSON: {virtuals: true}})
export class Event {
    @Prop()
    title: string;
    @Prop()
    place: string;
    @Prop()
    address: string;
    @Prop()
    description: string;
    @Prop()
    date: number;
    @Prop()
    dateEnd: number;
    @Prop({type: Boolean, default: false})
    ended: boolean;
    @Prop({type: Boolean, default: false})
    sellEnded: boolean;
    @Prop({ type: [EventPriceSchema] })
    prices: EventPriceDocument[];
    @Prop()
    image: string;
    @Prop({type: Boolean, default: true})
    show: boolean;
    @Prop({ type: EventReportSchema, default: () => ({}) })
    report: EventReportDocument
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual('tickets', {
    ref: "Ticket",
    localField: '_id',
    foreignField: 'event',
    justOne: false,
});

export type EventDocument = HydratedDocument<Event> & {
    tickets?: TicketDocument[];
};
