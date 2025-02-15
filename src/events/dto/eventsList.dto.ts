import {EventModel} from "../../mongo/models/event.model";

export interface IEventListDto {
    events: EventModel[]
    total: number
}