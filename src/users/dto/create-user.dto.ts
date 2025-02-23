import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {EUserRoles} from "../../auth/user.roles";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    login: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
    @IsEnum(EUserRoles)
    @ApiProperty({enum: EUserRoles})
    role: string;
}
