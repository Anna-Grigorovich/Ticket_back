import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import {JwtAuthGuard} from "../auth/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/roles.guard";
import {Roles} from "../auth/roles.decorator";
import {EUserRoles} from "../auth/user.roles";

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRoles.ADMIN, EUserRoles.SELLER, EUserRoles.MANAGER)
  @Get('event/:id')
  findAll(@Param('id') id: string) {
    return this.ticketsService.findAll(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRoles.ADMIN, EUserRoles.SELLER, EUserRoles.MANAGER)
  @Get(':eventId/:code')
  findOne(@Param('code') code: string, @Param('eventId') eventId: string) {
    return this.ticketsService.findOne(eventId, +code);
  }
}
