import {EventModel} from "./event.model";

export class EventListModel {
    total: number
    events: EventModel[]

    constructor(init?: Partial<EventListModel>) {
        Object.assign(this, init);
    }
}