import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {DashboardService} from "./dashboard.service";
import {JwtAuthGuard} from "../auth/guards/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {DashboardResponseDto} from "./dto/dashboard-response.dto";
import {User} from "../auth/decorators/user.decorator";
import {UserModel} from "../mongo/models/user.model";

@Controller('dashboard')
@ApiTags('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @ApiOperation({ summary: 'Get dashboard data' })
    @ApiResponse({type: DashboardResponseDto})
    async dashboard(@User() user: UserModel): Promise<DashboardResponseDto>{
        return  await this.dashboardService.getDashboard(user)
    }
}
