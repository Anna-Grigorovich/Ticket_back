import {UserModel} from "./user.model";

export class UserListModel {
    total: number
    users: UserModel[]

    constructor(init?: Partial<UserListModel>) {
        Object.assign(this, init);
    }
}