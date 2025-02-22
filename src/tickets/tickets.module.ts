import {Module} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {TicketsController} from './tickets.controller';
import {EmailService} from "../services/mail.service";
import {MongoModule} from "../mongo/mongo.module";
import {EventsModule} from "../events/events.module";
import {PaymentModule} from "../payment/payment.module";

@Module({
    imports: [
        MongoModule,
        EventsModule,
        PaymentModule
    ],
    controllers: [TicketsController],
    providers: [TicketsService, EmailService],
    exports: [TicketsService],
})
export class TicketsModule {
}
