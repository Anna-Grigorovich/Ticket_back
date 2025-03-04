import {Injectable, NotFoundException} from '@nestjs/common';
import {FindEventDto} from "../events/dto/find-event.dto";
import {EventReportListDto} from "./dto/event-report-list.dto";
import {EventRepository} from "../mongo/repositories/event.repository";

@Injectable()
export class ReportService {

    constructor(
        private eventsRepository: EventRepository,
    ) {}

    async getList(params: FindEventDto): Promise<EventReportListDto> {
        const {search, dateFrom, dateTo, skip = 0, limit = 10} = params;
        const filter: any = { ended: true };
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
        return await this.eventsRepository.getReportsList(filter, skip, limit)
    }

    async findOne(id: string) {
        const event = await this.eventsRepository.getReportById(id)
        if (!event) throw new NotFoundException('Not Found');
        return event
    }
}
