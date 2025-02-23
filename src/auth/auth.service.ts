import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import LoginDto from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import {UserRepository} from "../mongo/repositories/user.repository";
import LoginResponseDto from "./dto/login-response.dto";
import RegisterResponseDto from "./dto/register-response.dto";
import {UserModel} from "../mongo/models/user.model";
import RegisterDto from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
      private usersRepo: UserRepository,
      private jwtService: JwtService
  ) {}

  async login(login: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersRepo.findOne({login: login.login})
    if(!user) throw new UnauthorizedException('User not exists');

    const isMatch = await bcrypt.compare(login.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    const access = await this.jwtService.signAsync({id: user._id});
    return {access, role: user.role};
  }

  async register(currentUser: UserModel, login: RegisterDto): Promise<RegisterResponseDto> {
    const user = await this.usersRepo.findOne({login: login.login})
    if(user) throw new UnauthorizedException('User already exists');

    const hash = await bcrypt.hash(login.password, 10);
    const newUser =  await this.usersRepo.create({
      login: login.login,
      password: hash,
    });
    return RegisterResponseDto.fromUserModel(newUser);
  }
}
