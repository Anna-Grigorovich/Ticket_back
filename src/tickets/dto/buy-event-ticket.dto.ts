import {
    IsEmail, IsMongoId,
    IsNotEmpty,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class BuyEventTicketDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    mail: string;

    @IsNotEmpty()
    @IsMongoId()
    @ApiProperty()
    eventId: string;

    @IsNotEmpty()
    @ApiProperty()
    price: number;
}
