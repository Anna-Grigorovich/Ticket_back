import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class LoginDto {
    @IsNotEmpty()
    @ApiProperty()
    login: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}
