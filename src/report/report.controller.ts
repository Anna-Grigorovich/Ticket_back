import {Controller, Get, Param, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {EUserRoles} from "../auth/user.roles";
import {FindEventDto} from "../events/dto/find-event.dto";
import {EventReportDto} from "./dto/event-report.dto";
import {ReportService} from "./report.service";
import {EventReportListDto} from "./dto/event-report-list.dto";

@Controller('report')
@ApiTags('report')
export class ReportController {

    constructor(private readonly reportService: ReportService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Retrieve a single event report by event ID'})
    @ApiParam({name: 'id', description: 'The ID of the event', type: String})
    @ApiResponse({type: EventReportDto})
    async findOne(@Param('id') id: string): Promise<EventReportDto> {
        return EventReportDto.fromDoc(await this.reportService.findOne(id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({summary: 'Retrieve a list of all events with optional filters'})
    @ApiResponse({type: EventReportListDto})
    async findList(@Query() params: FindEventDto): Promise<EventReportListDto> {
        return await this.reportService.getList(params)
    }
}
