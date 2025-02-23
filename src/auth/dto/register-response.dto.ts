import {ApiProperty} from "@nestjs/swagger";
import {EUserRoles} from "../user.roles";
import {UserDocument} from "../../mongo/schemas/user.schema";
import {UserModel} from "../../mongo/models/user.model";

export default class RegisterResponseDto {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    login: string;
    @ApiProperty({enum: EUserRoles})
    role: EUserRoles

    constructor(init: Partial<RegisterResponseDto>) {
        Object.assign(this, init)
    }

    public static fromDoc(doc: UserDocument): RegisterResponseDto {
        return new RegisterResponseDto({
            _id: doc._id.toString(),
            login: doc.login,
            role: doc.role as EUserRoles,
        })
    }

    public static fromUserModel(userModel: UserModel): RegisterResponseDto {
        return new RegisterResponseDto({
            _id: userModel._id.toString(),
            login: userModel.login,
            role: userModel.role,
        })
    }
}
