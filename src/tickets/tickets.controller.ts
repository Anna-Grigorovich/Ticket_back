import {Controller, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {JwtAuthGuard} from "../auth/guards/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {EUserRoles} from "../auth/user.roles";

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.SELLER, EUserRoles.MANAGER)
    @Get('event/:id')
    findAll(@Param('id') id: string) {
        return this.ticketsService.findAll(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.SELLER, EUserRoles.MANAGER)
    @Get('ticket/:id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.SELLER, EUserRoles.MANAGER)
    @Patch('scan/:id')
    scanTicket(@Param('id') id: string) {
        return this.ticketsService.scanTicket(id);
    }
}
