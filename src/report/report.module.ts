import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import {MongoModule} from "../mongo/mongo.module";

@Module({
  imports: [MongoModule],
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
