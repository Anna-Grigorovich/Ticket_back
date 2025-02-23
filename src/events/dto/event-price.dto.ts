import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class EventPriceDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    price: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    place: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description: string;
}
