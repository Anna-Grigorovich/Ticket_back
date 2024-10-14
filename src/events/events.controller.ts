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
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query, UseGuards
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {FindUserDto} from "../users/dto/find-users.dto";
import {FindEventDto} from "./dto/find-event.dto";
import {JwtAuthGuard} from "../auth/auth.jwt.auth.guard";
import {RolesGuard} from "../auth/roles.guard";
import {Roles} from "../auth/roles.decorator";
import {EUserRoles} from "../auth/user.roles";

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
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
    return this.eventsService.findAllWithData(params);
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
