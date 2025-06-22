import {Injectable, Logger} from '@nestjs/common';
import {EventRepository} from "../mongo/repositories/event.repository";
import * as moment from 'moment-timezone';
import {Cron, CronExpression} from "@nestjs/schedule";
import {EventsService} from "./events.service";
import {EventModel} from "../mongo/models/event.model";

@Injectable()
export class EventsSchedulerService {
    private logger = new Logger(EventsSchedulerService.name);

    constructor(
        private eventsRepository: EventRepository,
        private eventService: EventsService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async handleEventsSellStop() {
        const startOfToday = moment().tz('UTC').startOf('day').valueOf(); // Start of today at 00:00 UTC
        const endOfToday = moment().tz('UTC').endOf('day').valueOf(); // End of today at 23:59:59 UTC
        await this.eventsRepository.stopSell(startOfToday, endOfToday)
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleEventsEnded() {
        const events = await this.eventsRepository.getEventsToClose();
        const eventsModels = events.map(e => EventModel.fromDoc(e))
        for (const eventModel of eventsModels) {
            this.logger.log(`event to close: ${eventModel._id.toString()}`)
            await this.eventService.closeEvent(eventModel._id.toString());
        }
    }
}
