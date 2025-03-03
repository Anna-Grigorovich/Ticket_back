import {
    ArrayMinSize,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import {EventPriceDto} from "./event-price.dto";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreateEventDto {
    @IsNotEmpty()
    @ApiProperty()
    title: string;
    @IsNotEmpty()
    @ApiProperty()
    place: string;
    @IsNotEmpty()
    @ApiProperty()
    address: string;
    @IsNotEmpty()
    @ApiProperty()
    description: string;
    @IsNumber()
    @ApiProperty()
    date: number;
    @IsNumber()
    @ApiProperty()
    dateEnd: number;
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => EventPriceDto)
    @ApiProperty({type: EventPriceDto, isArray: true})
    prices: EventPriceDto[];
    @IsOptional()
    @IsString()
    @ApiProperty({required: false})
    image: string;
    @IsBoolean()
    @IsOptional()
    @ApiProperty({required: false})
    show: boolean
    @IsBoolean()
    @IsOptional()
    @ApiProperty({required: false})
    ended: boolean
}
