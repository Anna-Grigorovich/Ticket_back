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

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Post()
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventsService.create(createEventDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('poster'))
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

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Get()
    findAll(@Query() params: FindEventDto) {
        return this.eventsService.getList(params);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        return this.eventsService.update(id, updateEventDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(EUserRoles.ADMIN, EUserRoles.MANAGER)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
}
