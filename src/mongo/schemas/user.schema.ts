import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {EUserRoles} from "../../auth/user.roles";

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
    @Prop({required: true})
    login: string;
    @Prop({required: true})
    password: string;
    @Prop({default: EUserRoles.SELLER})
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
