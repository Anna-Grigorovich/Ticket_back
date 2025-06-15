import {Module} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {TicketsController} from './tickets.controller';
import {EmailService} from "../services/mail.service";
import {MongoModule} from "../mongo/mongo.module";
import {SettingsService} from "../services/settings.service";
import {MailResendService} from "../services/mail-resend.service";

@Module({
    imports: [MongoModule],
    controllers: [TicketsController],
    providers: [TicketsService, EmailService, SettingsService, MailResendService],
    exports: [TicketsService],
})
export class TicketsModule {
}
