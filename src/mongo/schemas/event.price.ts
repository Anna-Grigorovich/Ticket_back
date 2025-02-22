import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from "mongoose";

@Schema({timestamps: false})
export class EventPrice {
    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: String, required: false })
    description: string;

    @Prop({ type: String, required: false })
    place: string;
}

export const EventPriceSchema = SchemaFactory.createForClass(EventPrice);
export type EventPriceDocument = HydratedDocument<EventPrice>