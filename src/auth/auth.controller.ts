import {Controller, Post, Body, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import LoginDto from "./dto/login.dto";
import {JwtAuthGuard} from "./guards/auth.jwt.auth.guard";
import {RolesGuard} from "./guards/roles.guard";
import {Roles} from "./decorators/roles.decorator";
import {EUserRoles} from "./user.roles";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body() register: LoginDto) {
        return await this.authService.register(register);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() login: LoginDto) {
        return this.authService.login(login);
    }
}
