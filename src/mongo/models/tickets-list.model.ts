import {EventModel} from "./event.model";
import {TicketModel} from "./ticket.model";

export class TicketsListModel {
    total: number
    tickets: TicketModel[]

    constructor(init?: Partial<TicketsListModel>) {
        Object.assign(this, init);
    }
}