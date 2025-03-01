import {forwardRef, Module} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import {TicketsModule} from "../tickets/tickets.module";
import {OrderModule} from "../order/order.module";

@Module({
  imports: [forwardRef(()=>OrderModule)],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
