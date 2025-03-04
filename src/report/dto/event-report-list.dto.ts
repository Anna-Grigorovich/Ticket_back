import {ApiProperty} from "@nestjs/swagger";
import {EventReportDto} from "./event-report.dto";

export class EventReportListDto {
    @ApiProperty({ type: EventReportDto, isArray:true, description: 'Array of event objects with report' })
    events: EventReportDto[];

    @ApiProperty({ type: Number, description: 'Total number of events found' })
    total: number;
}