import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {EventDocument} from "../schemas/event.schema";
import ObjectId = Types.ObjectId;
import {Jimp} from "jimp";
import * as path from "node:path";
import * as fs from 'fs';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class EventsService {
  constructor(
      @InjectModel(Event.name) private eventModel: Model<EventDocument>,
      private configService: ConfigService
  ){}

  async create(createEventDto: CreateEventDto) {
    return await new this.eventModel(createEventDto).save();
  }

  async findAll() {
    return await this.eventModel.find({}).exec();
  }

  async findOne(id: string) {
    const event = await this.eventModel.findById(new ObjectId(id)).exec()
    if(!event) throw new NotFoundException('Not Found');
    return event
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return await this.eventModel.findByIdAndUpdate(new ObjectId(id),updateEventDto, {new: true }).exec()
  }

  async remove(id: string) {
    return await this.eventModel.findByIdAndDelete(new ObjectId(id)).exec()
  }

  async uploadFile(id: string, file: Express.Multer.File){
    try {
      const outputFilePath = path.join(
          process.cwd(),
          this.configService.get('imagesPath')
      );
      if (!fs.existsSync(outputFilePath)) {
        fs.mkdirSync(outputFilePath, { recursive: true });
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
