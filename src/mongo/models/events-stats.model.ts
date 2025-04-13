export class EventsStatsModel {
    total: number;
    hidden: number;
    inSell: number;
    currentEvents: string[];
    totalTicketsSold: number;
    totalRevenue: number

    constructor(init?: Partial<EventsStatsModel>) {
        Object.assign(this, init);
    }
}