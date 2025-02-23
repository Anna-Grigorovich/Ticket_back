import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {omit} from "lodash";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FindUserDto} from "./dto/find-users.dto";
import {UserRepository} from "../mongo/repositories/user.repository";
import {UserModel} from "../mongo/models/user.model";
import {UserListModel} from "../mongo/models/user-list.model";

@Injectable()
export class UsersService {
    constructor(
        private usersRepo: UserRepository
    ) {
    }

    async create(data: CreateUserDto): Promise<UserModel> {
        const user: UserModel = await this.usersRepo.findOne({login: data.login})
        if (user) throw new BadRequestException('User already exists');

        const hash = await bcrypt.hash(data.password, 10);
        const newUser = await this.usersRepo.create({
            login: data.login,
            role: data.role,
            password: hash
        });

        return omit(newUser, ['password'])
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<UserModel> {
        if (data.password) {
            const hash = await bcrypt.hash(data.password, 10);
            data.password = hash;
        }
        return await this.usersRepo.updateById(id, data)
    }

    async removeUser(id: string) {
        return await this.usersRepo.deleteById(id)
    }

    async getUser(id: string): Promise<UserModel> {
        const user: UserModel = await this.usersRepo.findById(id)
        return omit(user, ['password'])
    }

    async getUsers(params: FindUserDto): Promise<UserListModel> {
        const {skip = 0, limit = 10, login, role} = params;
        const filter: any = {};
        if (login) {
            filter.login = new RegExp(login, 'i');
        }
        if (role) {
            filter.role = role;
        }
        return await this.usersRepo.getList(filter, skip, limit)
    }
}
