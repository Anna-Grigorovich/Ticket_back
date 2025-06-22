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
    @ApiProperty({ description: 'Event name', example: 'Music Festival' })
    title: string;
    @IsNotEmpty()
    @ApiProperty({ description: 'Event unique url', example: 'Music-Festival' })
    url: string;
    @IsNotEmpty()
    @ApiProperty({ description: 'Event place', example: 'Caribbean club' })
    place: string;
    @IsNotEmpty()
    @ApiProperty({ description: 'Event address', example: 'Mazepy street 3b' })
    address: string;
    @IsNotEmpty()
    @ApiProperty({ description: 'Event description', example: 'Make some fun' })
    description: string;
    @IsNumber()
    @ApiProperty({ description: 'Event date in timestamp ms', example: '1741132800000' })
    date: number;
    @IsNumber()
    @ApiProperty({ description: 'Event end date in timestamp ms', example: '1741132800000' })
    dateEnd: number;
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => EventPriceDto)
    @ApiProperty({type: EventPriceDto, isArray: true})
    prices: EventPriceDto[];
    @IsOptional()
    @IsString()
    @ApiProperty({required: false, description: 'not used at the moment'} )
    image: string;
    @IsBoolean()
    @IsOptional()
    @ApiProperty({required: false, description: 'show/hide event from site', default: true})
    show: boolean
}
