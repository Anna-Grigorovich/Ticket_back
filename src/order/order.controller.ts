import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateOrderResponseDto} from "./dto/create-order-response.dto";

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(
      private readonly orderService: OrderService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create order for a specific event' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ type: CreateOrderResponseDto})
  async create(@Body() createOrderDto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    return await this.orderService.create(createOrderDto);
  }
}
