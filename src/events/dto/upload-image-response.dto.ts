import {ApiProperty} from "@nestjs/swagger";

export class UploadImageResponseDto {
    @ApiProperty()
    message: string;
    @ApiProperty()
    path: string;

    constructor(init?: Partial<UploadImageResponseDto>) {
        Object.assign(this, init)
    }

}
