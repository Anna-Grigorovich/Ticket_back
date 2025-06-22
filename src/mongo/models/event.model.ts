import {Types} from "mongoose";
import ObjectId = Types.ObjectId;
import {EventDocument} from "../schemas/event.schema";
import {TicketModel} from "./ticket.model";
import {EventPriceModel} from "./event-price.model";
import {ReportModel} from "./report.model";

export class EventModel {
    _id: ObjectId;
    title: string;
    url: string;
    place: string;
    address: string;
    description: string;
    date: number;
    dateEnd: number;
    ended: boolean;
    sellEnded: boolean;
    prices: EventPriceModel[];
    image: string;
    show: boolean;
    tickets?: TicketModel[]
    report: ReportModel

    constructor(init?: Partial<EventModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: EventDocument): EventModel {
        if (!doc) return null;
        return new EventModel({
            _id: doc._id,
            title: doc.title,
            url: doc.url,
            place: doc.place,
            address: doc.address,
            description: doc.description,
            date: doc.date,
            dateEnd: doc.dateEnd,
            ended: doc.ended,
            sellEnded: doc.sellEnded,
            prices: doc.prices?.map(p=>EventPriceModel.fromDoc(p)),
            image: doc.image,
            show: doc.show,
            tickets: doc.tickets?.map(t => TicketModel.fromDoc(t)),
            report: ReportModel.fromDoc(doc.report)
        })
    }
}