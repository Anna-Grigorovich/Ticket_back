import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class EventPriceDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Event price', example: '100' })
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Event available ticket for sell in current price', example: '100' })
    available: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Place for current price', example: '3B' })
    place: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Description for current price', example: 'place fun zone' })
    description: string;
}
