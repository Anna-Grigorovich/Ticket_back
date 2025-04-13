import {ApiProperty} from "@nestjs/swagger";
import {EventsStatsModel} from "../../mongo/models/events-stats.model";

export class EventsStatsDto {
    @ApiProperty()
    total: number;
    @ApiProperty()
    hidden: number;
    @ApiProperty()
    inSell: number;
    @ApiProperty({type: String, isArray: true})
    currentEvents: string[];
    @ApiProperty()
    totalTicketsSold: number;
    @ApiProperty()
    totalRevenue: number

    constructor(init?: Partial<EventsStatsDto>) {
        Object.assign(this, init)
    }

    public static fromModel(eventsStats: EventsStatsModel): EventsStatsDto {
        return {
            total: eventsStats.total,
            hidden: eventsStats.hidden,
            inSell: eventsStats.inSell,
            currentEvents: eventsStats.currentEvents,
            totalTicketsSold: eventsStats.totalTicketsSold,
            totalRevenue: eventsStats.totalRevenue,
        }
    }
}
