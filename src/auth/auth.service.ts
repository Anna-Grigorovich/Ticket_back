import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import LoginDto from "./dto/login.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService
  ) {}

  async login(login: LoginDto): Promise<any> {
    const user = await this.usersService.getUser(login.login)
    if(!user) throw new UnauthorizedException('User not exists');
    const isMatch = await bcrypt.compare(login.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');
    const access = await this.jwtService.signAsync({id: user._id});
    return {access, role: user.role};
  }

  async register(login: LoginDto): Promise<any> {
    const user = await this.usersService.getUser(login.login)
    if(user) throw new UnauthorizedException('User already exists');
    const hash = await bcrypt.hash(login.password, 10);
    const newUser =  await this.usersService.create(login.login, hash);
    const access = await this.jwtService.signAsync({id: newUser._id});
    return access;
  }
}
