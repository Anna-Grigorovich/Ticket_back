import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Event, EventDocument} from "../schemas/event.schema";
import {CreateEventDto} from "../../events/dto/create-event.dto";
import {EventModel} from "../models/event.model";
import {UpdateEventDto} from "../../events/dto/update-event.dto";
import {EventListModel} from "../models/event-list.model";
import {EventReport} from "../schemas/event-report.data";
import {EventReportListDto} from "../../report/dto/event-report-list.dto";
import {EventReportDto} from "../../report/dto/event-report.dto";

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

    async decrementTicketsCounter(id: string, price: number, quantity: number): Promise<void> {
        await this.model.updateOne(
            {
                _id: id,
                'prices.price': price,
            },
            {
                $inc: { 'prices.$.available': -quantity },
            }
        );
    }

    async closeEvent(id: string, report: EventReport): Promise<void> {
        await this.model.findByIdAndUpdate(id, {
            ended: true,
            report: report,
        }).exec();
    }
}