import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {User, UserDocument} from "../schemas/user.schema";
import {Model, Types} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {omit} from "lodash";
import {UpdateUserDto} from "./dto/update-user.dto";
import ObjectId = Types.ObjectId;
import {FindUserDto} from "./dto/find-users.dto";

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

    async createNewUser(data: CreateUserDto){
        const user = await this.getUser(data.login)
        if(user) throw new BadRequestException('User already exists');
        const hash = await bcrypt.hash(data.password, 10);
        const newUser = await this.create(data.login, hash);
        const userObject = newUser.toObject();
        return omit(userObject, ['password'])
    }

    async updateUser(id: string, data: UpdateUserDto){
        if(data.password){
            const hash = await bcrypt.hash(data.password, 10);
            data.password = hash;
        }
        return await this.userModel.findByIdAndUpdate(new ObjectId(id), data, {new: true }).exec()
    }

    async removeUser(id: string) {
        return await this.userModel.findByIdAndDelete(new ObjectId(id)).exec()
    }

    async getOneUser(id: string){
        return await this.userModel.findById(new ObjectId(id)).select('-password').exec()
    }

    async getAllUsers(params: FindUserDto){
        const { skip = 0, limit = 10, login, role } = params;
        const query: any = {};
        if (login) {
            query.login = new RegExp(login, 'i');
        }
        if (role) {
            query.role = role;
        }

        const users = await this.userModel
            .find(query)
            .select('-password')   // Exclude the password field
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.userModel.countDocuments(query).exec();
        return {
            total,
            users,
        };
    }
}
