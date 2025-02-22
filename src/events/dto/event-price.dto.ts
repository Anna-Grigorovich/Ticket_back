import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class EventPriceDto {
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    place: string;

    @IsOptional()
    @IsString()
    description: string;
}
