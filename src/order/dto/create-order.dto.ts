import {IsEmail, IsMongoId, IsNotEmpty, IsNumber, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'Email address of the ticket owner', example: 'example@mail.com' })
    mail: string;

    @IsNotEmpty()
    @IsMongoId()
    @ApiProperty()
    @ApiProperty({ description: 'Event Id', example: '67c32050d051edd407b9d21d' })
    eventId: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Price of the ticket', example: 50 })
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty()
    @ApiProperty({ description: 'Quantity of tickets', example: 2 })
    quantity: number;
}
