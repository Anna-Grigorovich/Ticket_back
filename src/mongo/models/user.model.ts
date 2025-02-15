import {EUserRoles} from "../../auth/user.roles";
import {Types} from "mongoose";
import ObjectId = Types.ObjectId;
import {UserDocument} from "../schemas/user.schema";

export class UserModel {
    _id: ObjectId;
    login: string;
    password: string;
    role: EUserRoles;

    constructor(init?: Partial<UserModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: UserDocument): UserModel {
        if (!doc) return null;

        return new UserModel({
            _id: doc._id,
            login: doc.login,
            password: doc.password,
            role: doc.role as EUserRoles,
        })
    }
}