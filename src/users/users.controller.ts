import {
    Body,
    Controller, Delete, Get, Param, Patch,
    Post, Query, UseGuards,
} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FindUserDto} from "./dto/find-users.dto";
import {EUserRoles} from "../auth/user.roles";
import {Roles} from "../auth/roles.decorator";
import {JwtAuthGuard} from "../auth/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/roles.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createNewUser(createUserDto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.getOneUser(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Get()
    findAll(@Query() params: FindUserDto) {
        return this.usersService.getAllUsers(params);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.removeUser(id);
    }
}
