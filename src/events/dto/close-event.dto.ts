import {
    IsNotEmpty,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CloseEventDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Event id' })
    eventId: string;
}
