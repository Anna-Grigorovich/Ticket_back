import {EUserRoles} from "../../auth/user.roles";

export class FindUserDto {
    skip: number;
    limit: number;
    login: string;
    role: EUserRoles
}
