import {ApiProperty} from "@nestjs/swagger";
import {EUserRoles} from "../user.roles";

export default class LoginResponseDto {
    @ApiProperty()
    access: string;
    @ApiProperty({enum: EUserRoles})
    role: EUserRoles;
}
