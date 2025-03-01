import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {SettingsModel} from "../mongo/models/settings.model";
import {SettingsRepository} from "../mongo/repositories/settings.repository";

@Injectable()
export class SettingsService implements OnModuleInit {
    protected settings: SettingsModel

    constructor(private settingsRepo: SettingsRepository) {}

    async onModuleInit() {
        this.settings = await this.settingsRepo.getSettings();
    }

    public getSettings(): SettingsModel {
        return this.settings;
    }

    public async updateSettings(settings: SettingsModel) {
        await this.settingsRepo.updateSettings(settings);
        this.settings = settings;
    }

}