import {ApiProperty} from "@nestjs/swagger";
import {EventDocument} from "../../mongo/schemas/event.schema";
import {EventModel} from "../../mongo/models/event.model";
import {EventPriceResponseDto} from "./event-price-response.dto";
import {ReportDto} from "../../report/dto/report.dto";

export class EventResponseDto {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    url: string;
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
    @ApiProperty({type: ReportDto})
    report: ReportDto;

    constructor(init?: Partial<EventResponseDto>) {
        Object.assign(this, init)
    }

    public static fromDoc(doc: EventDocument, serviceFee: number, withReport: boolean = false): EventResponseDto {
        return new EventResponseDto({
            _id: doc._id.toString(),
            title: doc.title,
            url: doc.url,
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
            report: withReport? ReportDto.fromDoc(doc.report): undefined
        })
    }

    public static fromModel(model: EventModel, serviceFee: number, withReport: boolean = false): EventResponseDto {
        return {
            _id: model._id.toString(),
            title: model.title,
            url: model.url,
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
            report: withReport? ReportDto.fromModel(model.report): undefined
        }
    }
}
