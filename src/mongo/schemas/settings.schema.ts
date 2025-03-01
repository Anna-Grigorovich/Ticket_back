import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema()
export class Settings {
    @Prop({required: true})
    serviceFee: number;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
