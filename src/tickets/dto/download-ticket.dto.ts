import {ApiProperty} from "@nestjs/swagger";

export class DownloadTicketDto {
    @ApiProperty()
    data: string;
    @ApiProperty()
    signature: string;
}
