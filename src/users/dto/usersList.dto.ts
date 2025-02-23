import {UserResponseDto} from "./user-response.dto";
import {ApiProperty} from "@nestjs/swagger";
import {UserListModel} from "../../mongo/models/user-list.model";

export class UsersListResponseDto {
    @ApiProperty({ type: UserResponseDto, isArray: true, description: 'Array of user objects' })
    users: UserResponseDto[];

    @ApiProperty({ type: Number, description: 'Total number of users found', example: 100 })
    total: number;

    public static fromModel(model: UserListModel): UsersListResponseDto {
        return {
            total: model.total,
            users: model.users.map(u=> UserResponseDto.fromModel(u))
        }
    }
}