import { Controller, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {JwtAuthGuard} from "../auth/guards/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {EUserRoles} from "../auth/user.roles";
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TicketResponseDto} from "./dto/ticket-response.dto";

@Controller('tickets')
@ApiTags('tickets')
export class TicketsController {
    constructor(
        private readonly ticketsService: TicketsService,
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.SELLER, EUserRoles.MANAGER)
    @Get('ticket/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve details of a specific ticket (Admin/Seller/Manager only)' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the ticket', type: String })
    @ApiResponse({  type: TicketResponseDto })
    async findOne(@Param('id') id: string): Promise<TicketResponseDto> {
        return TicketResponseDto.fromModel(await this.ticketsService.findOne(id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.SELLER, EUserRoles.MANAGER)
    @Patch('scan/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Scan a ticket (Admin/Seller/Manager only)' })
    @ApiParam({ name: 'id', description: 'Unique identifier of the ticket to scan', type: String })
    @ApiResponse({  type: TicketResponseDto })
    async scanTicket(@Param('id') id: string): Promise<TicketResponseDto> {
        return TicketResponseDto.fromModel(await this.ticketsService.scanTicket(id));
    }
}
