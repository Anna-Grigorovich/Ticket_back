import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Event, EventDocument} from "../schemas/event.schema";
import {CreateEventDto} from "../../events/dto/create-event.dto";
import {EventModel} from "../models/event.model";
import {UpdateEventDto} from "../../events/dto/update-event.dto";
import {EventListModel} from "../models/event-list.model";
import {EventReportDto} from "../../report/dto/event-report.dto";
import {EventsStatsModel} from "../models/events-stats.model";
import {OrderModel} from "../models/order.model";
import {EventReportListDto} from "../../report/dto/event-report-list.dto";

@Injectable()
export class EventRepository {
    constructor(@InjectModel(Event.name) private model: Model<Event>) {
    }

    async create(createEventDto: CreateEventDto): Promise<EventModel> {
        const newEvent = await new this.model(createEventDto).save();
        return EventModel.fromDoc(newEvent);
    }

    async getList(filter: Partial<Event> = {}, skip: number, limit: number): Promise<EventListModel> {
        const events: EventDocument[] = await this.model.aggregate([
            {$match: filter},
            {
                $lookup: {
                    from: 'tickets',
                    localField: '_id',
                    foreignField: 'event',
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
            events: events.map(e => EventModel.fromDoc(e))
        }
    }

    async getReportsList(filter: Partial<Event> = {}, skip: number, limit: number): Promise<EventReportListDto> {
        const events: EventDocument[] = await this.model.aggregate([
            {$match: filter},
            {$skip: Number(skip)},
            {$limit: Number(limit)},
        ]);

        const total = await this.model.countDocuments(filter).exec();

        return {
            total,
            events: events.map(e => EventReportDto.fromDoc(e))
        }
    }

    async getDashboardStats(): Promise<EventsStatsModel> {
        const now = Date.now();
        const [result] = await this.model.aggregate([
            {
                $facet: {
                    total: [{ $count: 'value' }],
                    hidden: [{ $match: { show: false } }, { $count: 'value' }],
                    inSell: [{ $match: { sellEnded: false } }, { $count: 'value' }],
                    currentEvents: [
                        {
                            $match: {
                                ended: false,
                                date: { $lt: now },
                                dateEnd: { $gt: now }
                            }
                        },
                        { $project: { title: 1, _id: 0 } }
                    ],
                    reportTotals: [
                        {
                            $group: {
                                _id: null,
                                totalTicketsSold: { $sum: '$report.tickets_sell' },
                                totalRevenue: { $sum: '$report.total' }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    total: { $arrayElemAt: ['$total.value', 0] },
                    hidden: { $arrayElemAt: ['$hidden.value', 0] },
                    inSell: { $arrayElemAt: ['$inSell.value', 0] },
                    currentEvents: '$currentEvents',
                    totalTicketsSold: {
                        $ifNull: [{ $arrayElemAt: ['$reportTotals.totalTicketsSold', 0] }, 0]
                    },
                    totalRevenue: {
                        $ifNull: [{ $arrayElemAt: ['$reportTotals.totalRevenue', 0] }, 0]
                    }
                }
            }]);
        return {
            total: result.total || 0,
            hidden: result.hidden || 0,
            inSell: result.inSell || 0,
            currentEvents: result.currentEvents.map(e => e.title),
            totalTicketsSold: result.totalTicketsSold,
            totalRevenue: result.totalRevenue
        };
    }

    async getById(id: string, full: boolean): Promise<EventDocument | null> {
        if (full){
            return await this.model.findOne({ _id: id }).exec();
        }
        return await this.model.findOne({ _id: id, show: true }).exec();
    }

    async getReportById(id: string): Promise<EventDocument | null> {
        return await this.model.findOne({ _id: id, ended: true }).exec();
    }

    async getByIdWithTickets(id: string): Promise<EventModel> {
        const event = await this.model.findById(id).populate('tickets').exec();
        return EventModel.fromDoc(event)
    }

    async updateById(id: string, updateData: Partial<UpdateEventDto>): Promise<EventModel | null> {
        const updated = await this.model.findByIdAndUpdate(id, updateData, {new: true}).exec();
        return EventModel.fromDoc(updated);
    }

    async deleteById(id: string): Promise<EventModel | null> {
        const deleted = await this.model.findByIdAndDelete(id).exec();
        return EventModel.fromDoc(deleted);
    }

    async stopSell(startDay: number, endDay: number): Promise<void> {
        await this.model.updateMany(
            {
                date: { $gte: startDay, $lte: endDay },
                sellEnded: { $ne: true }
            },
            { $set: { sellEnded: true } }
        );
    }

    async getEventsToClose(): Promise<EventDocument[]> {
        return this.model.find({
            dateEnd: { $lte: Date.now() },
            ended: false
        })
    }

    async addToReport(order: OrderModel): Promise<void> {
        const {price, serviceFee, quantity, providerFee} = order;
        await this.model.updateOne(
            {
                _id: order.event._id,
                'prices.price': price
            },
            {
                $inc: {
                    'prices.$.available': -quantity,
                    'report.tickets_sell': quantity,
                    'report.price': price * quantity,
                    'report.serviceFee': serviceFee * quantity,
                    'report.lp_receiver_commission': providerFee,
                    'report.total': (price + serviceFee) * quantity - providerFee
                }
            }
        ).exec();
    }

    async closeEvent(id: string): Promise<void> {
        await this.model.findByIdAndUpdate(id, {
            ended: true,
        }).exec();
    }
}