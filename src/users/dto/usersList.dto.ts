import {UserModel} from "../../mongo/models/user.model";

export interface IUsersListDto {
    users: UserModel[]
    total: number
}