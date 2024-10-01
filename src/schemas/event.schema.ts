import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {EUserRoles} from "../auth/user.roles";

export type EventDocument = HydratedDocument<Event>;

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
    date: string;
    @Prop()
    price: number;
    @Prop()
    image: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual('tickets', {
    ref: "Ticket",
    localField: '_id',
    foreignField: 'event',
    justOne: false,
});
