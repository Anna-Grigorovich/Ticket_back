import {Controller, Post, Body, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import LoginDto from "./dto/login.dto";
import {JwtAuthGuard} from "./guards/auth.jwt.auth.guard";
import {RolesGuard} from "./guards/roles.guard";
import {Roles} from "./decorators/roles.decorator";
import {EUserRoles} from "./user.roles";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import LoginResponseDto from "./dto/login-response.dto";
import RegisterResponseDto from "./dto/register-response.dto";
import {User} from "./decorators/user.decorator";
import {UserModel} from "../mongo/models/user.model";
import RegisterDto from "./dto/register.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @HttpCode(HttpStatus.OK)
    @Post('register')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Register a new user (Admin/Manager only)' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({type: RegisterResponseDto})
    async register(@User() user: UserModel, @Body() register: RegisterDto): Promise<RegisterResponseDto> {
        return await this.authService.register(user, register);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'User login and JWT token retrieval' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({type: LoginResponseDto})
    login(@Body() login: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(login);
    }
}
