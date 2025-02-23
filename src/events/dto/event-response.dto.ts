import {EventPriceDto} from "./event-price.dto";
import {ApiProperty} from "@nestjs/swagger";
import {EventDocument} from "../../mongo/schemas/event.schema";
import {EventModel} from "../../mongo/models/event.model";

export class EventResponseDto {
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

    constructor(init?: Partial<EventResponseDto>) {
        Object.assign(this, init)
    }

    public static fromDoc(doc: EventDocument): EventResponseDto {
        return new EventResponseDto({...doc.toObject, _id: doc._id.toString()})
    }

    public static fromModel(model: EventModel): EventResponseDto {
        return {
            _id: model._id.toString(),
            title: model.title,
            place: model.place,
            address: model.address,
            description: model.description,
            date: model.date,
            prices: model.prices,
            image: model.image,
            show: model.show,
            ended: model.ended,
        }
    }
}
