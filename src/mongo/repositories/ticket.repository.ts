import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Ticket, TicketDocument} from "../schemas/ticket.schema";
import {CreateTicketDto} from "../../tickets/dto/create-ticket.dto";
import {TicketModel} from "../models/ticket.model";
import {TicketsListModel} from "../models/tickets-list.model";
import {TicketsStatsModel} from "../models/tickets-stats.model";

@Injectable()
export class TicketRepository {
    constructor(@InjectModel(Ticket.name) private model: Model<Ticket>) {
    }

    async create(createTicketDto: CreateTicketDto): Promise<TicketModel> {
        const newTicket = await new this.model(createTicketDto).save();
        return TicketModel.fromDoc(newTicket);
    }

    async getList(filter: Partial<Ticket> = {}, skip: number, limit: number): Promise<TicketsListModel> {
        const tickets: TicketDocument[] = await this.model.aggregate([
            {$match: filter},
            {
                $lookup: {
                    from: 'tickets',
                    localField: '_id',
                    foreignField: 'ticket',
                    as: 'tickets',
                },
            },
            {
                $addFields: {
                    sell_count: {$size: '$tickets'},
                },
            },
            {
                $project: {
                    tickets: 0,
                },
            },
            {$skip: Number(skip)},
            {$limit: Number(limit)},
        ]);

        const total = await this.model.countDocuments(filter).exec();

        return {
            total,
            tickets: tickets.map(e => TicketModel.fromDoc(e))
        }
    }

    async getDashboardStats(): Promise<TicketsStatsModel> {
        const [result] = await this.model.aggregate([
            {
                $facet: {
                    globalAvailable: [
                        { $match: { scanned: false } },
                        { $count: 'value' }
                    ],
                    globalScanned: [
                        { $match: { scanned: true } },
                        { $count: 'value' }
                    ]
                }
            },
            {
                $project: {
                    totalAvailable: { $ifNull: [{ $arrayElemAt: ['$globalAvailable.value', 0] }, 0] },
                    totalScanned: { $ifNull: [{ $arrayElemAt: ['$globalScanned.value', 0] }, 0] },
                }
            }
        ]);

        return {
            totalAvailable: result.totalAvailable,
            totalScanned: result.totalScanned,
        };
    }

    async getById(id: string): Promise<TicketModel> {
        const ticket = await this.model.findById(id).populate('event').exec();
        return TicketModel.fromDoc(ticket)
    }

    async updateById(id: string, updateData: Partial<TicketModel>): Promise<TicketModel | null> {
        const updated = await this.model.findByIdAndUpdate(id, updateData, {new: true}).exec();
        return TicketModel.fromDoc(updated);
    }

    async deleteById(id: string): Promise<TicketModel | null> {
        const deleted = await this.model.findByIdAndDelete(id).exec();
        return TicketModel.fromDoc(deleted);
    }

    async cleanUp(eventId: string){
        await this.model.deleteMany({ event: eventId }).exec();
    }
}