import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    place: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    description: string;
    @IsString()
    date: string;
    @IsNumber()
    price: string;
    image: string;
}
