import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginDto from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() register: LoginDto){
    return await this.authService.register(register);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }
}
