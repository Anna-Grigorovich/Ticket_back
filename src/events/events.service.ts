import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {Jimp} from "jimp";
import * as path from "node:path";
import * as fs from 'fs';
import {ConfigService} from "@nestjs/config";
import {FindEventDto} from "./dto/find-event.dto";
import {EventRepository} from "../mongo/repositories/event.repository";
import {EventListDto} from "./dto/eventsList.dto";
import {EventModel} from "../mongo/models/event.model";

@Injectable()
export class EventsService {
    constructor(
        private configService: ConfigService,
        private eventsRepository: EventRepository
    ) {
    }

    async create(createEventDto: CreateEventDto) {
        return await this.eventsRepository.create(createEventDto);
    }

    async getList(params: FindEventDto): Promise<EventListDto> {
        const {search, dateFrom, dateTo, skip = 0, limit = 10} = params;
        const filter: any = {};

        if (search) {
            filter.$or = [
                {title: new RegExp(search, 'i')},
                {place: new RegExp(search, 'i')},
                {address: new RegExp(search, 'i')},
                {description: new RegExp(search, 'i')}
            ];
        }

        if (dateFrom || dateTo) {
            filter.date = {};
            if (dateFrom) {
                filter.date.$gte = dateFrom;
            }
            if (dateTo) {
                filter.date.$lte = dateTo;
            }
        }
        return EventListDto.fromModel(await this.eventsRepository.getList(filter, skip, limit))
    }

    async findOne(id: string) {
        const event = await this.eventsRepository.getById(id)
        if (!event) throw new NotFoundException('Not Found');
        return event
    }

    async validatePrice(id: string, price: number): Promise<EventModel> {
        const event = EventModel.fromDoc(await this.eventsRepository.getById(id))
        if (!event) throw new NotFoundException('Not Found');
        const priceModel = event.prices.find(p => p.price === price);
        if (!priceModel) throw new NotFoundException('Price Not Found');
        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto) {
        return await this.eventsRepository.updateById(id, updateEventDto)
    }

    async remove(id: string) {
        await this.removeFileById(id)
        return await this.eventsRepository.deleteById(id);
    }

    async removeFileById(id: string): Promise<void> {
        try {
            const filePath = path.join(process.cwd(), this.configService.get('imagesPath'), `${id}.jpg`);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (error) {
            throw new Error(`Failed to remove file with id ${id}: ${error.message}`);
        }
    }

    async uploadFile(id: string, file: Express.Multer.File) {
        try {
            const outputFilePath = path.join(
                process.cwd(),
                this.configService.get('imagesPath')
            );
            if (!fs.existsSync(outputFilePath)) {
                fs.mkdirSync(outputFilePath, {recursive: true});
            }

            const image = await Jimp.read(file.buffer);
            image.resize({w: 400});
            const filePath = path.join(outputFilePath, `${id}.jpg`);
            // @ts-ignore
            await image.write(filePath);
            return {
                message: 'Image uploaded successfully!',
                path: `images/${id}.jpg`,
            };
        } catch (error) {
            throw new Error('Failed to process the image');
        }
    }
}
