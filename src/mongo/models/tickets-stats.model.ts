export class TicketsStatsModel {
    totalAvailable: number;
    totalScanned: number;

    constructor(init?: Partial<TicketsStatsModel>) {
        Object.assign(this, init);
    }
}