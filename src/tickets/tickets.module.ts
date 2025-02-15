import {Module} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {TicketsController} from './tickets.controller';
import {EmailService} from "../services/mail.service";
import {MongoModule} from "../mongo/mongo.module";

@Module({
    imports: [
        MongoModule,
    ],
    controllers: [TicketsController],
    providers: [TicketsService, EmailService],
})
export class TicketsModule {
}
