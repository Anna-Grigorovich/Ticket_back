import { ApiProperty } from '@nestjs/swagger';
import { EventResponseDto } from '../../events/dto/event-response.dto';
import {TicketModel} from "../../mongo/models/ticket.model"; // Adjust the path based on your project structure

export class TicketResponseDto {
    @ApiProperty({ type: EventResponseDto, description: 'Event details associated with the ticket' })
    event: EventResponseDto;

    @ApiProperty({ description: 'Unique ticket code (not used at the moment)', example: '1234567890' })
    code: string;

    @ApiProperty({ description: 'Price of the ticket', example: 50 })
    price: number;

    @ApiProperty({ description: 'Discount applied to the ticket', example: 10 })
    discount: number;

    @ApiProperty({ description: 'Additional data related to the ticket (not used at the moment)', example: 'Row A, Seat 12' })
    data: string;

    @ApiProperty({ description: 'Email address of the ticket owner', example: 'example@mail.com' })
    mail: string;

    public static fromModel(model: TicketModel): TicketResponseDto {
        return {
            event: EventResponseDto.fromModel(model.event),
            code: model.code,
            price: model.price,
            discount: model.discount,
            data: model.data,
            mail: model.mail,
        }
    }
}
