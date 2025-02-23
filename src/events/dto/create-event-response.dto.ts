import {EventPriceDto} from "./event-price.dto";
import {ApiProperty} from "@nestjs/swagger";
import {EventModel} from "../../mongo/models/event.model";

export class CreateEventResponseDto {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    place: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    date: number;
    @ApiProperty({type: EventPriceDto, isArray: true})
    prices: EventPriceDto[];
    @ApiProperty()
    image: string;
    @ApiProperty()
    show: boolean
    @ApiProperty()
    ended: boolean

    constructor(init?: Partial<CreateEventResponseDto>) {
        Object.assign(this, init)
    }

    public static fromModel(model: EventModel): CreateEventResponseDto {
        return new CreateEventResponseDto({...model, _id: model._id.toString()})
    }
}
