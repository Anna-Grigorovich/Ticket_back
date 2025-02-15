import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {Event, EventSchema} from "./schemas/event.schema";
import {Ticket, TicketSchema} from "./schemas/ticket.schema";
import {User, UserSchema} from "./schemas/user.schema";
import {EventRepository} from "./repositories/event.repository";
import {UserRepository} from "./repositories/user.repository";
import {TicketRepository} from "./repositories/ticket.repository";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                dbName: configService.get<string>('MONGODB_DATABASE') || 'develop',
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{name: Event.name, schema: EventSchema}]),
        MongooseModule.forFeature([{name: Ticket.name, schema: TicketSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    providers: [
        EventRepository,
        UserRepository,
        TicketRepository,
    ],
    exports: [
        EventRepository,
        UserRepository,
        TicketRepository,
    ]
})
export class MongoModule {
}
