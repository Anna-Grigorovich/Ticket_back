import {EventDocument} from "../../mongo/schemas/event.schema";
import {LiqPayCallbackModel} from "../../mongo/models/payment-result.model";

export class CreateTicketDto {
    event: EventDocument;
    price: number;
    serviceFee: number;
    mail: string;
    payment: LiqPayCallbackModel;
}
