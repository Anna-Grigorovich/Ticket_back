import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';

import {ConfigService} from "@nestjs/config";
import {createTicketPdf} from "../utils/generate.ticket";
import * as path from "path";
import * as fs from "fs";
import {EventRepository} from "../mongo/repositories/event.repository";
import {TicketRepository} from "../mongo/repositories/ticket.repository";
import {TicketModel} from "../mongo/models/ticket.model";
import {EventModel} from "../mongo/models/event.model";
import {LiqPayCallbackModel} from "../mongo/models/payment-result.model";
import {IAttachment} from "../services/mail.interfaces";
import {MailResendService} from "../services/mail-resend.service";

@Injectable()
export class TicketsService {

    constructor(
        private configService: ConfigService,
        private eventsRepository: EventRepository,
        private ticketsRepository: TicketRepository,
        private mailService: MailResendService
    ) {
        // this.generateTestTicket()
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

    async createTickets(eventId: string, mail: string, price: number, serviceFee: number, payment: LiqPayCallbackModel, quantity: number) {
        const event = await this.eventsRepository.getById(eventId, true)
        if (!event) throw new NotFoundException('Event Not Found, Can`t create ticket');
        const attachments: IAttachment[] = [];
        for (let i=0; i < quantity; i++) {
            const ticket= await this.ticketsRepository.create({event, price, serviceFee, mail, payment})
            const ticketPath = await this.generateTicketPdf(ticket, ticket.event);
            attachments.push({
                path: ticketPath,
                filename: `ticket_${i}.pdf`
            })
        }
        await this.mailService.sendMail('tickets@toptickets.com.ua', mail, event.title, attachments);
        attachments.forEach(attachment => {
            fs.unlink(attachment.path, () => {})
        })
    }

    protected async generateTestTicket() {
        const ticket : TicketModel = await this.ticketsRepository.getById('6867be8c46bc38530435dcbd');
        console.log(ticket);
        const pdfPath = await this.generateTicketPdf(ticket, ticket.event);
        console.log(`PDF generated at: ${pdfPath}`);
    }

    protected async generateTicketPdf(ticket: TicketModel, event: EventModel): Promise<string> {
        const imagePath = path.join(process.cwd(), this.configService.get<string>('imagesPath'), event._id + '.jpg')
        const pdfPath = path.join(process.cwd(), this.configService.get<string>('tempPath'), ticket._id.toString() + '.pdf')
        await createTicketPdf(ticket, event, imagePath, pdfPath);
        return pdfPath;
    }
}
