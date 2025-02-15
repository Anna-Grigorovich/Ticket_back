import {Types} from "mongoose";
import ObjectId = Types.ObjectId;
import {EventDocument} from "../schemas/event.schema";
import {TicketModel} from "./ticket.model";

export class EventModel {
    _id: ObjectId;
    title: string;
    place: string;
    address: string;
    description: string;
    date: number;
    ended: boolean;
    price: number;
    image: string;
    show: boolean;
    tickets?: TicketModel[]

    constructor(init?: Partial<EventModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: EventDocument): EventModel {
        if (!doc) return null;
        return new EventModel({
            _id: doc._id,
            title: doc.title,
            place: doc.place,
            address: doc.address,
            description: doc.description,
            date: doc.date,
            ended: doc.ended,
            price: doc.price,
            image: doc.image,
            show: doc.show,
            tickets: doc.tickets?.map(t => TicketModel.fromDoc(t))
        })
    }
}