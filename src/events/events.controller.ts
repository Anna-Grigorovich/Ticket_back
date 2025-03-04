import {
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import {EventsService} from './events.service';
import {FindEventDto} from "./dto/find-event.dto";
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {EventResponseDto} from "./dto/event-response.dto";
import {EventListDto} from "./dto/eventsList.dto";
import {SettingsService} from "../services/settings.service";
import {SettingsModel} from "../mongo/models/settings.model";

@Controller('events')
@ApiTags('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly settingsService: SettingsService,
        ) {
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a single event by its ID' })
    @ApiParam({ name: 'id', description: 'The ID of the event', type: String })
    @ApiResponse({type: EventResponseDto})
    async findOne(@Param('id') id: string): Promise<EventResponseDto> {
        const settings: SettingsModel = this.settingsService.getSettings();
        return EventResponseDto.fromDoc(await this.eventsService.findOne(id), settings.serviceFee);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve a list of all events with optional filters' })
    @ApiResponse({ type: EventListDto })
    async findList(@Query() params: FindEventDto):Promise<EventListDto> {
        return  await this.eventsService.getList(params)
    }
}
