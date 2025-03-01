import {Controller, Post, Req, HttpStatus, HttpCode, HttpException, Logger} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {ApiExcludeController, ApiOperation, ApiTags} from "@nestjs/swagger";
import {OrderService} from "../order/order.service";
import {LiqPayCallbackModel} from "../mongo/models/payment-result.model";

@Controller('payment')
@ApiTags('payment')
@ApiExcludeController()
export class PaymentController {
  private logger = new Logger(PaymentController.name);

  constructor(
      private readonly paymentService: PaymentService,
      private readonly orderService: OrderService,
  ) {}

  @Post('callback')
  @ApiOperation({ summary: 'Handle payment provider callback for ticket payments' })
  @HttpCode(200)
  async callback(@Req() req: Request) {
    // @ts-ignore
    const { data, signature } = req.body;
    const isValid = this.paymentService.verifyCallback(data, signature);
    if (!isValid) {
      throw new HttpException('Invalid Signature', HttpStatus.FORBIDDEN);
    }
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    const liqPayModel = LiqPayCallbackModel.fromLiqPayCallback(decodedData);
    this.logger.log(JSON.stringify(decodedData))
    if(liqPayModel.status === 'success') {
      try {
        await this.orderService.orderPayed(liqPayModel)
      }catch (e) {
        this.logger.error(liqPayModel)
      }
    }
    return true
  }
}
