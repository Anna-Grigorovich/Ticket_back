import {Controller, Post, Req, HttpException, HttpStatus} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {TicketsService} from "../tickets/tickets.service";

@Controller('payment')
export class PaymentController {
  constructor(
      private readonly paymentService: PaymentService,
      private readonly ticketsService: TicketsService
  ) {}

  @Post('callback')
  async callback(@Req() req: Request) {
    // @ts-ignore
    const { data, signature } = req.body;
    const isValid = this.paymentService.verifyCallback(data, signature);
    if (!isValid) {
      throw new HttpException('Invalid Signature', HttpStatus.FORBIDDEN);
    }
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    if(decodedData.status === 'success') {
      try {
        await this.ticketsService.ticketPayed(decodedData.order_id, decodedData)
      }catch (e) {
        console.log(e);
      }
    }
    return true
  }
}
