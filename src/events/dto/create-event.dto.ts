import {
    ArrayMinSize,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested
} from "class-validator";
import {EventPriceDto} from "./event-price.dto";
import {Type} from "class-transformer";

export class CreateEventDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    place: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    description: string;
    @IsNumber()
    date: number;
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => EventPriceDto)
    prices: EventPriceDto[];
    @IsOptional()
    @IsString()
    image: string;
    @IsBoolean()
    @IsOptional()
    show: boolean
    @IsBoolean()
    @IsOptional()
    ended: boolean
}
