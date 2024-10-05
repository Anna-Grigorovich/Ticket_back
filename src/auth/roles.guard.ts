import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY} from "./roles.decorator";
import {EUserRoles} from "./user.roles";
import {UsersService} from "../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<EUserRoles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) throw new UnauthorizedException('User not found');
        const userFromDatabase = await this.usersService.getUserRoleByID(user.id)
        return requiredRoles.some((role) => userFromDatabase.role?.includes(role));
    }
}
