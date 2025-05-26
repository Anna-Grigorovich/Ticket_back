import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
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
import {SettingsService} from "../services/settings.service";
import {SettingsModel} from "../mongo/models/settings.model";
import {TicketRepository} from "../mongo/repositories/ticket.repository";
import {OrderRepository} from "../mongo/repositories/order.repository";
import {OrderModel} from "../mongo/models/order.model";

@Injectable()
export class EventsService {
    private logger: Logger = new Logger(EventsService.name);

    constructor(
        private configService: ConfigService,
        private eventsRepository: EventRepository,
        private ticketsRepository: TicketRepository,
        private ordersRepository: OrderRepository,
        private settingsService: SettingsService,
    ) {}

    validateDates(createEventDto: CreateEventDto){
        if(createEventDto.dateEnd < createEventDto.date) throw new BadRequestException('Invalid end date');
        if(createEventDto.dateEnd < Date.now()) throw new BadRequestException('Invalid end date');
    }

    async create(createEventDto: CreateEventDto) {
        return await this.eventsRepository.create(createEventDto);
    }

    async getList(params: FindEventDto): Promise<EventListDto> {
        const {search, dateFrom, dateTo, skip = 0, limit = 10} = params;
        const filter: any = {};
        filter.show = true
        filter.ended = false;
        const settings: SettingsModel = this.settingsService.getSettings();
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
        return EventListDto.fromModel(await this.eventsRepository.getList(filter, skip, limit), settings.serviceFee, false)
    }

    async getListBo(params: FindEventDto, full: boolean = false, withReport: boolean = false): Promise<EventListDto> {
        const {search, dateFrom, dateTo, onlyActive, skip = 0, limit = 10} = params;
        const filter: any = {};
        if(!full){
            filter.show = true
        }
        const settings: SettingsModel = this.settingsService.getSettings();
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
        if(onlyActive){
            filter.show = true;
            filter.ended = false;
        }
        return EventListDto.fromModel(await this.eventsRepository.getList(filter, skip, limit), settings.serviceFee, withReport)
    }

    async findOne(id: string, full: boolean = false) {
        const event = await this.eventsRepository.getById(id, full)
        if (!event) throw new NotFoundException('Not Found');
        return event
    }

    async validatePrice(id: string, price: number, quantity: number): Promise<EventModel> {
        const event = EventModel.fromDoc(await this.eventsRepository.getById(id, true))
        if (!event) throw new BadRequestException('Not Found');
        const priceModel = event.prices.find(p => p.price === price);
        if (!priceModel) throw new BadRequestException('Price Not Found');
        if(priceModel.available<=0) throw new BadRequestException('No more tickets available');
        if(priceModel.available< quantity) throw new BadRequestException(`Only ${priceModel.available} tickets available`);
        return event;
    }

    async addToReport(order: OrderModel): Promise<void> {
        await this.eventsRepository.addToReport(order);
    }

    async update(id: string, updateEventDto: UpdateEventDto) {
        const event = EventModel.fromDoc(await this.eventsRepository.getById(id, true))
        if(event.ended) throw new BadRequestException('Cannot edit ended event');
        return await this.eventsRepository.updateById(id, updateEventDto)
    }

    async remove(id: string) {
        const doc = await this.eventsRepository.getById(id, true);
        if (!doc) throw new BadRequestException('Event not found');

        const event = EventModel.fromDoc(doc);
        if (!event.ended) throw new BadRequestException('Cannot remove not ended event');

        await this.removeFileById(id);
        return  await this.eventsRepository.deleteById(id);
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

    async closeEvent(id: string): Promise<void> {
        const event = await this.eventsRepository.getById(id, true);
        if (!event) {
            throw new Error('Event not found');
        }
        if (event.ended) {
            throw new Error('Event is already closed.');
        }

        await this.eventsRepository.closeEvent(id);

        // Remove all associated tickets from the database
        await this.ticketsRepository.cleanUp(id);
        // Remove all associated orders from the database
        await this.ordersRepository.cleanUp(id);

        this.logger.log(`Event ${id} closed successfully.`);
    }

}
