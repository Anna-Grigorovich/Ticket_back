import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import {MongoModule} from "../mongo/mongo.module";
import {SettingsService} from "../services/settings.service";

@Module({
  imports:[MongoModule],
  controllers: [DashboardController],
  providers: [DashboardService, SettingsService]
})
export class DashboardModule {}
