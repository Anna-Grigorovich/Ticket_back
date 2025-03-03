import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class FindEventDto {
    @ApiPropertyOptional({ description: 'Search text for event title, place, address, or description', example: 'Music Festival' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter events starting from this date (timestamp)', example: 1704067200 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    dateFrom?: number;

    @ApiPropertyOptional({ description: 'Filter events up to this date (timestamp)', example: 1706659200 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    dateTo?: number;

    @ApiPropertyOptional({ description: 'Number of records to skip for pagination', example: 0 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    skip: number;

    @ApiPropertyOptional({ description: 'Maximum number of records to return', example: 10 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit: number;
}
