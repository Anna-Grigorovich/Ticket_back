import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class RegisterDto {
    @IsNotEmpty()
    @ApiProperty()
    login: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}
