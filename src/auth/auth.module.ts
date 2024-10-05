import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "../users/users.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./auth.jwt.strategy";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return configService.get('auth')
      },
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
