import {ApiProperty} from "@nestjs/swagger";

export class CreateOrderResponseDto {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    data: string;

    @ApiProperty()
    signature: string;
}
