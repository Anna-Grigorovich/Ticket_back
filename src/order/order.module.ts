import {forwardRef, Module} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {MongoModule} from "../mongo/mongo.module";
import {SettingsService} from "../services/settings.service";
import {PaymentModule} from "../payment/payment.module";
import {EventsModule} from "../events/events.module";
import {TicketsModule} from "../tickets/tickets.module";

@Module({
  imports: [MongoModule, EventsModule, TicketsModule, forwardRef(()=>PaymentModule)],
  controllers: [OrderController],
  providers: [OrderService, SettingsService],
  exports: [OrderService]
})
export class OrderModule {}
