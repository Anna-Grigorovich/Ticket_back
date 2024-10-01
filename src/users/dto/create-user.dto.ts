import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {EUserRoles} from "../../auth/user.roles";

export class CreateUserDto {
    @IsNotEmpty()
    login: string;
    @IsNotEmpty()
    password: string;
    @IsEnum(EUserRoles)
    role: string;
}
