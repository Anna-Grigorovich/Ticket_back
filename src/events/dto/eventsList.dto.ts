import {ApiProperty} from "@nestjs/swagger";
import {EventResponseDto} from "./event-response.dto";
import {EventListModel} from "../../mongo/models/event-list.model";

export class EventListDto {
    @ApiProperty({ type: EventResponseDto, isArray:true, description: 'Array of event objects' })
    events: EventResponseDto[];

    @ApiProperty({ type: Number, description: 'Total number of events found' })
    total: number;

    public static fromModel(model: EventListModel, serviceFee: number): EventListDto{
        return {
            events: model.events.map(e=> EventResponseDto.fromModel(e, serviceFee)),
            total: model.total
        }
    }
}