import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {UserModel} from "../models/user.model";
import {UserListModel} from "../models/user-list.model";
import {Settings, SettingsDocument} from "../schemas/settings.schema";
import {SettingsModel} from "../models/settings.model";

@Injectable()
export class SettingsRepository {
    constructor(@InjectModel(Settings.name) private model: Model<Settings>) {}

    async getSettings(): Promise<SettingsModel> {
        let settings: SettingsDocument = await this.model.findOne().exec();
        if (!settings) {
            settings = await this.createSettings();
        }
        return SettingsModel.fromDoc(settings);
    }

    async createSettings(): Promise<SettingsDocument> {
        return await new this.model({
            serviceFee: 10
        }).save();
    }

    async updateSettings(update: Partial<SettingsModel>): Promise<void> {
        await this.model.findOneAndUpdate({}, update, { upsert: true }).exec();
    }
}
