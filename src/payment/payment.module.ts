import {forwardRef, Module} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import {TicketsModule} from "../tickets/tickets.module";

@Module({
  imports: [forwardRef(()=>TicketsModule)],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
