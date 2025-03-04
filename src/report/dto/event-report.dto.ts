import {ApiProperty} from "@nestjs/swagger";
import {ReportDto} from "./report.dto";
import {EventDocument} from "../../mongo/schemas/event.schema";

export class EventReportDto {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    place: string;
    @ApiProperty()
    date: number;
    @ApiProperty()
    dateEnd: number
    @ApiProperty({type: ReportDto})
    report: ReportDto;

    constructor(init?: Partial<EventReportDto>) {
        Object.assign(this, init)
    }

    public static fromDoc(doc: EventDocument): EventReportDto {
        return new EventReportDto({
            _id: doc._id.toString(),
            title: doc.title,
            place: doc.place,
            date: doc.date,
            dateEnd: doc.dateEnd,
            report: ReportDto.fromDoc(doc.report)
        })
    }
}
