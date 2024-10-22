import {BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Event, EventDocument} from "../schemas/event.schema";
import {Ticket, TicketDocument} from "../schemas/ticket.schema";
import ObjectId = Types.ObjectId;
import * as nodemailer from 'nodemailer';
import {ConfigService} from "@nestjs/config";
import {createTicketPdf} from "../utils/generate.ticket";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class TicketsService {
  private transporter;
  protected logger = new Logger('Email service');

  constructor(
      @InjectModel(Event.name) private eventModel: Model<EventDocument>,
      @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
      private configService: ConfigService,

  ){
    this.transporter = nodemailer.createTransport(this.configService.get('mail'));
    //this.createTicket('67016312dde4a9a228bbb64d', 'zorinuk@mail.com')
  }

  async create(event: ObjectId, code: number, discount: number, data: string) {
    return await new this.ticketModel({event, code, discount, data}).save()
  }

  findAll(eventId: string) {
    return this.eventModel.findById(new ObjectId(eventId)).populate('tickets').exec()
  }

  async findOne(eventId: string, ticketId: string) {
    let ticket: TicketDocument;
    try {
      ticket = await this.ticketModel.findById(ticketId).exec();
    }catch (e){}
    if(!ticket) throw new NotFoundException('Not Found');
    if(ticket.event.toString() !== eventId) throw new HttpException('Wrong event', HttpStatus.BAD_REQUEST);
    if(ticket.scanned) throw new HttpException('Already scanned', HttpStatus.CONFLICT);
    ticket.scanned = true;
    await ticket.save();
    return ticket
  }

  async createTicket(eventId: string, mail: string) {
    const event = await this.eventModel.findById(new ObjectId(eventId)).exec()
    if(!event) throw new NotFoundException('Event Not Found, Can`t create ticket');
    const ticket= await this.create(new ObjectId(eventId),0,0,'');
    const imagePath = path.join(process.cwd(), this.configService.get<string>('imagesPath'), eventId + '.jpg')
    const tempPath = path.join(process.cwd(), this.configService.get<string>('tempPath'), ticket._id.toString() + '.pdf')
    await createTicketPdf(ticket._id.toString(), event, imagePath, tempPath);
    const result = await this.sendMail(
        `Твій квиток на подію ${event.title}`,
        tempPath
    );
    //@ts-ignore
    this.logger.log('Email sent: ' + result.response);
    fs.unlink(tempPath, ()=>{});
  }

  async sendMail(text: string, tempPath: string){
    let mailOptions = {
      from: 'ticketsTo',
      to: 'zorinuk@gmail.com',
      subject: 'Твій квиток',
      text: text,
      attachments: [
        {
          filename: 'ticketTo.pdf',
          path: tempPath
        }
      ]
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}
