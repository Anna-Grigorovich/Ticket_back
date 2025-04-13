import {ApiProperty} from "@nestjs/swagger";
import {UserModel} from "../../mongo/models/user.model";
import {EventsStatsModel} from "../../mongo/models/events-stats.model";
import {TicketsStatsModel} from "../../mongo/models/tickets-stats.model";
import {EventsStatsDto} from "./eventsStats.dto";
import {TicketsStatsDto} from "./ticketsStats.dto";

export class DashboardResponseDto {
    @ApiProperty()
    userName: string;

    @ApiProperty()
    userRole: string;

    @ApiProperty()
    serviceFee: number;

    @ApiProperty({type: EventsStatsDto})
    eventsStats: EventsStatsDto;

    @ApiProperty({type: TicketsStatsDto})
    ticketsStats: TicketsStatsDto;

    constructor(init?: Partial<DashboardResponseDto>) {
        Object.assign(this, init)
    }

    public static fromModels(user: UserModel, serviceFee: number, eventsStats: EventsStatsModel, ticketsStats: TicketsStatsModel): DashboardResponseDto {
        return {
            userName: user.login,
            userRole: user.role,
            serviceFee,
            eventsStats: EventsStatsDto.fromModel(eventsStats),
            ticketsStats: TicketsStatsDto.fromModel(ticketsStats)
        }
    }
}
