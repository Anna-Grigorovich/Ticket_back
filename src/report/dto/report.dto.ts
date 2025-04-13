import {ApiProperty} from "@nestjs/swagger";
import {EventReportDocument} from "../../mongo/schemas/event-report.data";
import {ReportModel} from "../../mongo/models/report.model";
export class ReportDto {
    @ApiProperty()
    tickets_sell: number;
    @ApiProperty()
    price: number;
    @ApiProperty()
    serviceFee: number;
    @ApiProperty()
    lp_receiver_commission: number;
    @ApiProperty()
    total: number

    constructor(init?: Partial<ReportDto>) {
        Object.assign(this, init)
    }

    public static fromDoc(doc: EventReportDocument): ReportDto {
        if(!doc) return null;
        return new ReportDto({
            tickets_sell: doc.tickets_sell,
            price: doc.price,
            serviceFee: doc.serviceFee,
            lp_receiver_commission: doc.lp_receiver_commission,
            total: doc.total
        })
    }

    public static fromModel(model: ReportModel): ReportDto {
        if(!model) return null;
        return {
            tickets_sell: model.tickets_sell,
            price: model.price,
            serviceFee: model.serviceFee,
            lp_receiver_commission: model.lp_receiver_commission,
            total: model.total
        }
    }
}
