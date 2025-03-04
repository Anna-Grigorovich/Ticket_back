import {EventPrice, EventPriceDocument} from "../schemas/event.price";

export class EventPriceModel {
    _id: string;
    price: number;
    description: string;
    place: string;
    available: number

    constructor(init?: Partial<EventPriceModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: EventPriceDocument): EventPriceModel {
        if (!doc) return null;
        return new EventPriceModel({
            _id: doc._id.toString(),
            price: doc.price,
            description: doc.description,
            place: doc.place,
            available: doc.available
        })
    }
}