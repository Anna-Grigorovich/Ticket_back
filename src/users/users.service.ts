import { Injectable } from '@nestjs/common';
import {User, UserDocument} from "../schemas/user.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){}

    async getUser(login: string){
        const user: UserDocument = await this.userModel.findOne({login}).exec();
        return user;
    }

    async create(login: string, hash: string): Promise<any> {
        const user = new this.userModel({
            login: login,
            password: hash
        });
        await user.save();
        return user;
    }
}
