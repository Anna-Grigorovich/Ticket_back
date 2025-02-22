import {Body, Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {JwtAuthGuard} from "../auth/guards/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {EUserRoles} from "../auth/user.roles";
import {EventsService} from "../events/events.service";
import {BuyEventTicketDto} from "./dto/buy-event-ticket.dto";
import {PaymentService} from "../payment/payment.service";

@Controller('tickets')
export class TicketsController {
    constructor(
        private readonly ticketsService: TicketsService,
        private readonly eventsService: EventsService,
        private readonly paymentService: PaymentService,
    ) {
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

    @Post('buy')
    async buyTicketForEvent(@Body() buyEventDto: BuyEventTicketDto) {
        await this.eventsService.validatePrice(buyEventDto.eventId, buyEventDto.price);
        const newTicket = await this.ticketsService.newTicket(buyEventDto.eventId, buyEventDto.mail, buyEventDto.price)
        return this.paymentService.getTicketPaymentForm(newTicket);
    }
}
