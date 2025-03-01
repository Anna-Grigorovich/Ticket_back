import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from "mongoose";

@Schema()
export class PaymentData {
    @Prop()
    transactionId: number;
    @Prop()
    orderId: string;
    @Prop()
    status: string;
    @Prop()
    amount: number;
    @Prop()
    currency: string;
    @Prop()
    senderFirstName: string;
    @Prop()
    senderLastName: string;
    @Prop()
    receiverCommission: number;
    @Prop()
    senderCommission: number;
    @Prop()
    agentCommission: number;
}

export const PaymentDataSchema = SchemaFactory.createForClass(PaymentData);
export type PaymentDataDocument = HydratedDocument<PaymentData>