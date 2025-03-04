import {ApiProperty} from "@nestjs/swagger";
import {EventDocument} from "../../mongo/schemas/event.schema";
import {EventModel} from "../../mongo/models/event.model";
import {EventPriceResponseDto} from "./event-price-response.dto";

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
    @ApiProperty()
    dateEnd: number
    @ApiProperty({type: EventPriceResponseDto, isArray: true})
    prices: EventPriceResponseDto[];
    @ApiProperty()
    image: string;
    @ApiProperty()
    show: boolean
    @ApiProperty()
    ended: boolean
    @ApiProperty()
    sellEnded: boolean;

    constructor(init?: Partial<EventResponseDto>) {
        Object.assign(this, init)
    }

    public static fromDoc(doc: EventDocument, serviceFee: number): EventResponseDto {
        return new EventResponseDto({
            _id: doc._id.toString(),
            title: doc.title,
            place: doc.place,
            address: doc.address,
            description: doc.description,
            date: doc.date,
            dateEnd: doc.dateEnd,
            prices: doc.prices.map(p => EventPriceResponseDto.fromDoc(p, serviceFee)),
            image: doc.image,
            show: doc.show,
            ended: doc.ended,
            sellEnded: doc.sellEnded,
        })
    }

    public static fromModel(model: EventModel, serviceFee: number): EventResponseDto {
        return {
            _id: model._id.toString(),
            title: model.title,
            place: model.place,
            address: model.address,
            description: model.description,
            date: model.date,
            dateEnd: model.dateEnd,
            prices: model.prices.map(p => EventPriceResponseDto.fromModel(p, serviceFee)),
            image: model.image,
            show: model.show,
            ended: model.ended,
            sellEnded: model.sellEnded,
        }
    }
}
