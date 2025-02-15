import {TicketModel} from "../../mongo/models/ticket.model";

export interface ITicketsListDto {
    tickets: TicketModel[]
    total: number
}