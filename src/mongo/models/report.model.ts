import {EventReportDocument} from "../schemas/event-report.data";

export class ReportModel {
    tickets_sell: number;
    price: number;
    serviceFee: number;
    lp_receiver_commission: number;
    total: number

    constructor(init?: Partial<ReportModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: EventReportDocument): ReportModel {
        if(!doc) return null;
        return new ReportModel({
            tickets_sell: doc.tickets_sell,
            price: doc.price,
            serviceFee: doc.serviceFee,
            lp_receiver_commission: doc.lp_receiver_commission,
            total: doc.total,
        })
    }
}