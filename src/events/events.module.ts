import {Module} from '@nestjs/common';
import {EventsService} from './events.service';
import {EventsController} from './events.controller';
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "../users/users.module";
import {MongoModule} from "../mongo/mongo.module";
import {SettingsService} from "../services/settings.service";
import {EventsSchedulerService} from "./events-scheduler.service";

@Module({
    imports: [
        ConfigModule,
        MongoModule,
        UsersModule
    ],
    controllers: [EventsController],
    providers: [EventsService, SettingsService, EventsSchedulerService],
    exports: [EventsService]
})
export class EventsModule {
}
