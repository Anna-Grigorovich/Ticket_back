import {ApiProperty} from "@nestjs/swagger";
import {EventPriceModel} from "../../mongo/models/event-price.model";
import {roundPrice} from "../../utils/number-util";
import {EventPriceDocument} from "../../mongo/schemas/event.price";

export class EventPriceResponseDto {
    @ApiProperty()
    price: number;

    @ApiProperty()
    serviceFee: number;

    @ApiProperty()
    priceTotal: number;

    @ApiProperty()
    place: string;

    @ApiProperty()
    description: string;

    public static fromModel(price: EventPriceModel, serviceFee: number): EventPriceResponseDto{
        const fee = roundPrice(serviceFee/100 * price.price);
        return {
            price: price.price,
            serviceFee: fee,
            priceTotal: price.price + fee,
            place: price.place,
            description: price.description
        }
    }

    public static fromDoc(price: EventPriceDocument, serviceFee: number): EventPriceResponseDto{
        const fee = roundPrice(serviceFee/100 * price.price);
        return {
            price: price.price,
            serviceFee: fee,
            priceTotal: price.price + fee,
            place: price.place,
            description: price.description
        }
    }
}
