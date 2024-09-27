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

@Injectable()
export class EventsService {
  constructor(
      @InjectModel(Event.name) private eventModel: Model<EventDocument>
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
      const outputFilePath = path.join(__dirname,'../', 'files');
      if (!fs.existsSync(outputFilePath)) {
        fs.mkdirSync(outputFilePath, { recursive: true });
      }
      const image = await Jimp.read(file.buffer);
      image.resize({w: 400});
      await image.write(`${outputFilePath}/${id}.jpg`);
      return {
        message: 'Image uploaded successfully!',
        filePath: outputFilePath,
      };
    } catch (error) {
      console.error('Error processing the image:', error);
      throw new Error('Failed to process the image');
    }
  }
}
