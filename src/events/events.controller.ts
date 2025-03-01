import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe, FileTypeValidator, Query, UseGuards, NotFoundException
} from '@nestjs/common';
import {EventsService} from './events.service';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {FindEventDto} from "./dto/find-event.dto";
import {JwtAuthGuard} from "../auth/guards/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {EUserRoles} from "../auth/user.roles";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {CreateEventResponseDto} from "./dto/create-event-response.dto";
import {UploadImageResponseDto} from "./dto/upload-image-response.dto";
import {EventResponseDto} from "./dto/event-response.dto";
import {EventListDto} from "./dto/eventsList.dto";

@Controller('events')
@ApiTags('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a single event by its ID' })
    @ApiParam({ name: 'id', description: 'The ID of the event', type: String })
    @ApiResponse({type: EventResponseDto})
    async findOne(@Param('id') id: string): Promise<EventResponseDto> {
        return EventResponseDto.fromDoc(await this.eventsService.findOne(id));
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve a list of all events with optional filters' })
    @ApiResponse({ type: EventListDto })
    async findList(@Query() params: FindEventDto):Promise<EventListDto> {
        return  await this.eventsService.getList(params)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({summary: 'Add a new event (Admin/Manager only)'})
    @ApiBody({type: CreateEventDto})
    @ApiResponse({type: CreateEventResponseDto})
    async create(@Body() createEventDto: CreateEventDto): Promise<CreateEventResponseDto> {
        return CreateEventResponseDto.fromModel(await this.eventsService.create(createEventDto));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('poster'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload poster image for an event (Admin/Manager only)' })
    @ApiParam({ name: 'id', description: 'The ID of the event', type: String })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                poster: {
                    type: 'string',
                    format: 'binary',
                    description: 'Poster image file (JPEG/PNG only)'
                }
            }
        }
    })
    @ApiResponse({type: UploadImageResponseDto})
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: 'image/jpeg|image/png'}),
                ],
            }),
        ) file: Express.Multer.File,
        @Param('id') id: string) {
        return this.eventsService.uploadFile(id, file);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update event details (Admin/Manager only)' })
    @ApiParam({ name: 'id', description: 'The ID of the event', type: String })
    @ApiBody({ type: UpdateEventDto })
    @ApiResponse({ type: EventResponseDto })
    async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
        return EventResponseDto.fromModel(await this.eventsService.update(id, updateEventDto));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete an event by its ID (Admin/Manager only)' })
    @ApiParam({ name: 'id', description: 'The ID of the event', type: String })
    @ApiResponse({ type: EventResponseDto })
    async remove(@Param('id') id: string): Promise<EventResponseDto> {
        return EventResponseDto.fromModel(await this.eventsService.remove(id));
    }
}
