import {IsNotEmpty} from "class-validator";

export default class LoginDto {
    @IsNotEmpty()
    login: string;
    @IsNotEmpty()
    password: string;
}
