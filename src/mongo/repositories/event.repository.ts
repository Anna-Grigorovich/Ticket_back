import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Event, EventDocument} from "../schemas/event.schema";
import {CreateEventDto} from "../../events/dto/create-event.dto";
import {EventModel} from "../models/event.model";
import {IEventListDto} from "../../events/dto/eventsList.dto";
import {UpdateEventDto} from "../../events/dto/update-event.dto";

@Injectable()
export class EventRepository {
    constructor(@InjectModel(Event.name) private model: Model<Event>) {
    }

    async create(createEventDto: CreateEventDto): Promise<EventModel> {
        const newEvent = await new this.model(createEventDto).save();
        return EventModel.fromDoc(newEvent);
    }

    async getList(filter: Partial<Event> = {}, skip: number, limit: number): Promise<IEventListDto> {
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

    async getById(id: string): Promise<EventDocument> {
        return await this.model.findById(id).exec();
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
}