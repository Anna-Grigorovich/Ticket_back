import {ApiProperty} from "@nestjs/swagger";
import {EventReportDocument} from "../../mongo/schemas/event-report.data";
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
        return new ReportDto({
            tickets_sell: doc.tickets_sell,
            price: doc.price,
            serviceFee: doc.serviceFee,
            lp_receiver_commission: doc.lp_receiver_commission,
            total: doc.total
        })
    }
}
