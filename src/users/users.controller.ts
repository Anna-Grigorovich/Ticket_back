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
import {Roles} from "../auth/decorators/roles.decorator";
import {JwtAuthGuard} from "../auth/guards/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {UserResponseDto} from "./dto/user-response.dto";
import {UsersListResponseDto} from "./dto/usersList.dto";

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new user (Admin only)' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({  type: UserResponseDto })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return UserResponseDto.fromModel(await this.usersService.create(createUserDto));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve user details by ID (Admin only)' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the user', type: String })
    @ApiResponse({  type: UserResponseDto })
    async findOne(@Param('id') id: string): Promise<UserResponseDto> {
        return UserResponseDto.fromModel(await this.usersService.getUser(id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve a list of users with optional filters (Admin only)' })
    @ApiResponse({  type: UsersListResponseDto })
    async findAll(@Query() params: FindUserDto): Promise<UsersListResponseDto> {
        return UsersListResponseDto.fromModel(await this.usersService.getUsers(params));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user details (Admin only)' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the user', type: String })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({  type: UserResponseDto })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return UserResponseDto.fromModel(await this.usersService.updateUser(id, updateUserDto));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a user by ID (Admin only)' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the user', type: String })
    @ApiOkResponse()
    remove(@Param('id') id: string) {
        return this.usersService.removeUser(id);
    }
}
