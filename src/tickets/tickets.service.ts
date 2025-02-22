import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';

import {ConfigService} from "@nestjs/config";
import {createTicketPdf} from "../utils/generate.ticket";
import * as path from "path";
import * as fs from "fs";
import {EventRepository} from "../mongo/repositories/event.repository";
import {TicketRepository} from "../mongo/repositories/ticket.repository";
import {TicketModel} from "../mongo/models/ticket.model";
import {EventModel} from "../mongo/models/event.model";
import {EmailService} from "../services/mail.service";

@Injectable()
export class TicketsService {

    constructor(
        private configService: ConfigService,
        private eventsRepository: EventRepository,
        private ticketsRepository: TicketRepository,
        private mailService: EmailService
    ) { }

    findAll(eventId: string) {
        return this.eventsRepository.getByIdWithTickets(eventId);
    }

    async findOne(id: string) {
        const ticket = await this.ticketsRepository.getById(id)
        if (!ticket) throw new NotFoundException('Not Found');
        return ticket
    }

    async scanTicket(id: string) {
        const ticket = await this.ticketsRepository.getById(id)
        if (!ticket) throw new NotFoundException('Not Found');
        if (ticket.scanned) throw new HttpException('Already scanned', HttpStatus.CONFLICT);
        await this.ticketsRepository.updateById(id, {scanned: true})
        return ticket
    }

    async newTicket(eventId: string, mail: string, price: number, code?: string, discount?: number, data?: string){
        const event = await this.eventsRepository.getById(eventId)
        if (!event) throw new NotFoundException('Event Not Found, Can`t create ticket');
        return await this.ticketsRepository.create({event, price, mail, code, discount, data})
    }

    async ticketPayed(ticketId: string, payment: object){
        const ticket = await this.ticketsRepository.getById(ticketId);
        if(!ticket) {
            console.log(`payment for ticketId: ${ticketId} not found ticket`);
            return
        }
        ticket.payment = payment;
        ticket.payed = true;
        await this.ticketsRepository.updateById(ticketId, ticket)
        const ticketPath = await this.generateTicketPdf(ticket, ticket.event);
        await this.mailService.sendMail('topTickets', ticket.mail, ticket.event.title, ticketPath);
        fs.unlink(ticketPath, () => {
        });
    }

    async generateTicketPdf(ticket: TicketModel, event: EventModel): Promise<string> {
        const imagePath = path.join(process.cwd(), this.configService.get<string>('imagesPath'), event._id + '.jpg')
        const pdfPath = path.join(process.cwd(), this.configService.get<string>('tempPath'), ticket._id.toString() + '.pdf')
        await createTicketPdf(ticket, event, imagePath, pdfPath);
        return pdfPath;
    }
}
