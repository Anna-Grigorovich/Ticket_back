import {EUserRoles} from "../../auth/user.roles";
import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../../mongo/models/user.model";

export class UserResponseDto {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    login: string;
    @ApiProperty({enum: EUserRoles})
    role: string;

    public static fromModel(model: UserModel): UserResponseDto {
        return {
            login: model.login,
            role: model.role,
            _id: model._id.toString()
        }
    }
}
