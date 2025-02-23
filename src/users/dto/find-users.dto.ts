import {EUserRoles} from "../../auth/user.roles";
import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class FindUserDto {
    @ApiPropertyOptional({ description: 'Number of records to skip for pagination', example: 0 })
    @IsOptional()
    @IsNumber()
    skip?: number;

    @ApiPropertyOptional({ description: 'Maximum number of records to return', example: 10 })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ description: 'Filter users by login', example: 'john_doe' })
    @IsOptional()
    @IsString()
    login?: string;

    @ApiPropertyOptional({ description: 'Filter users by role', enum: EUserRoles, example: EUserRoles.ADMIN })
    @IsOptional()
    @IsEnum(EUserRoles)
    role?: EUserRoles;
}
