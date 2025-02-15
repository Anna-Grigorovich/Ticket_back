import {EventDocument} from "../../mongo/schemas/event.schema";

export class CreateTicketDto {
    event: EventDocument;
    code?: string;
    price: number;
    discount?: number;
    data?: string;
    mail?: string;
}
