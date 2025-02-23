import {TicketModel} from "../../mongo/models/ticket.model";
import {TicketResponseDto} from "./ticket-response.dto";

export class TicketsListDto {
    tickets: TicketResponseDto[]
    total: number
}