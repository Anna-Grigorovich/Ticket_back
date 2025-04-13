import {ApiProperty} from "@nestjs/swagger";
import {TicketsStatsModel} from "../../mongo/models/tickets-stats.model";

export class TicketsStatsDto {
    @ApiProperty()
    totalAvailable: number;
    @ApiProperty()
    totalScanned: number;

    constructor(init?: Partial<TicketsStatsDto>) {
        Object.assign(this, init)
    }

    public static fromModel(ticketsStats: TicketsStatsModel): TicketsStatsDto {
        return {
            totalAvailable: ticketsStats.totalAvailable,
            totalScanned: ticketsStats.totalScanned,
        }
    }
}
