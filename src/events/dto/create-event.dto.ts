import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

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
    @IsNumber()
    price: string;
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
