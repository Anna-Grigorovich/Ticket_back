import {
    IsEmail, IsMongoId,
    IsNotEmpty,
} from "class-validator";


export class BuyEventTicketDto {
    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsNotEmpty()
    @IsMongoId()
    eventId: string;

    @IsNotEmpty()
    price: number;
}
