import {Types} from "mongoose";
import ObjectId = Types.ObjectId;
import {TicketDocument} from "../schemas/ticket.schema";
import {EventModel} from "./event.model";
import {PaymentData} from "../schemas/payment.data";

export class TicketModel {
    _id: ObjectId;
    event: EventModel;
    code: string;
    discount: number;
    data: string;
    scanned: boolean;
    mail: string;
    price: number;
    serviceFee: number;
    payment: PaymentData;

    constructor(init?: Partial<TicketModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: TicketDocument): TicketModel {
        if (!doc) return null;
        return new TicketModel({
            _id: doc._id,
            event: EventModel.fromDoc(doc.event),
            code: doc.code,
            discount: doc.discount,
            data: doc.data,
            scanned: doc.scanned,
            mail: doc.mail,
            price: doc.price,
            serviceFee: doc.serviceFee,
            payment: doc.payment
        })
    }
}