import { Controller, Get, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('event/:id')
  findAll(@Param('id') id: string) {
    return this.ticketsService.findAll(id);
  }

  @Get(':eventId/:code')
  findOne(@Param('code') code: string, @Param('eventId') eventId: string) {
    return this.ticketsService.findOne(eventId, +code);
  }
}
