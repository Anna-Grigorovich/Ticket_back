import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {UserModel} from "../models/user.model";
import {UserListModel} from "../models/user-list.model";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private model: Model<User>) {
    }

    async create(userData: Partial<User>): Promise<UserModel> {
        const savedUser = await new this.model(userData).save();
        return UserModel.fromDoc(savedUser)
    }

    async findById(id: string): Promise<UserModel | null> {
        const user = await this.model.findById(id).exec();
        return UserModel.fromDoc(user)
    }

    async findOne(filter: Partial<User>): Promise<UserModel | null> {
        const user: UserDocument = await this.model.findOne(filter).exec();
        return UserModel.fromDoc(user)
    }

    async getList(filter: Partial<User> = {}, skip: number, limit: number): Promise<UserListModel> {
        const users = await this.model
            .find(filter)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.model.countDocuments(filter)
        return {
            users: users.map(user => UserModel.fromDoc(user)),
            total
        }
    }

    async updateById(id: string, updateData: Partial<User>): Promise<UserModel | null> {
        const updatedUser = await this.model.findByIdAndUpdate(id, updateData, {new: true}).exec();
        return UserModel.fromDoc(updatedUser);
    }

    async deleteById(id: string): Promise<UserModel | null> {
        const deletedUser = await this.model.findByIdAndDelete(id).exec();
        return UserModel.fromDoc(deletedUser);
    }
}