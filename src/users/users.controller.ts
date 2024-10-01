import {
    Body,
    Controller, Delete, Get, Param, Patch,
    Post,
} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createNewUser(createUserDto)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.getOneUser(id);
    }

    @Get()
    findAll() {
        return this.usersService.getAllUsers();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.removeUser(id);
    }
}
