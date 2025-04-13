import {Types} from "mongoose";
import ObjectId = Types.ObjectId;
import {EventModel} from "./event.model";
import {OrderDocument} from "../schemas/order.schema";

export class OrderModel {
    _id: ObjectId;
    event: EventModel;
    mail: string;
    price: number;
    serviceFee: number;
    providerFee: number;
    quantity: number;
    payed: boolean;
    payment: object;

    constructor(init?: Partial<OrderModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: OrderDocument): OrderModel {
        if (!doc) return null;
        return new OrderModel({
            _id: doc._id,
            event: EventModel.fromDoc(doc.event),
            mail: doc.mail,
            price: doc.price,
            payed: doc.payed,
            payment: doc.payment,
            serviceFee: doc.serviceFee,
            providerFee: doc.providerFee,
            quantity: doc.quantity
        })
    }
}