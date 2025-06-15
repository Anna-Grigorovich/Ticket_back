import {BadRequestException, Injectable} from '@nestjs/common';
import {OrderModel} from "../mongo/models/order.model";
import {PaymentService} from "../payment/payment.service";
import {OrderRepository} from "../mongo/repositories/order.repository";
import {CreateOrderDto} from "./dto/create-order.dto";
import {EventsService} from "../events/events.service";
import {SettingsService} from "../services/settings.service";
import {roundPrice} from "../utils/number-util";
import {PaymentData} from "../payment/interfaces/payment-data.interface";
import {CreateOrderResponseDto} from "./dto/create-order-response.dto";
import {TicketsService} from "../tickets/tickets.service";
import {LiqPayCallbackModel} from "../mongo/models/payment-result.model";

@Injectable()
export class OrderService {

    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderRepository: OrderRepository,
        private readonly eventsService: EventsService,
        private readonly settingsService: SettingsService,
        private readonly ticketsService: TicketsService,
    ) {
    }

    async create(createOrderDto: CreateOrderDto): Promise<CreateOrderResponseDto> {
        const event = await this.eventsService.validatePrice(createOrderDto.eventId, createOrderDto.price, createOrderDto.quantity);
        if (event.sellEnded) throw new BadRequestException('Sell already ended for this event');
        const totalFee: number = roundPrice(createOrderDto.price * this.settingsService.getSettings().serviceFee / 100);
        const order = await this.orderRepository.create(new OrderModel({
            event,
            mail: createOrderDto.mail,
            price: createOrderDto.price,
            serviceFee: totalFee,
            quantity: createOrderDto.quantity,
            payed: false
        }));
        order.event = event;
        const payment: PaymentData = this.paymentService.getPaymentData(order);
        return {
            _id: order._id.toString(),
            data: payment.data,
            signature: payment.signature
        }
    }

    async orderPayed(callbackModel: LiqPayCallbackModel): Promise<void> {
        const providerFee: number = callbackModel.agentCommission + callbackModel.receiverCommission;
        const _order = await this.orderRepository.getById(callbackModel.orderId);
        if(_order.payed === false) {
            const order = await this.orderRepository.update(callbackModel.orderId, {payed: true, providerFee, payment: callbackModel});
            await this.eventsService.addToReport(order);
            await this.ticketsService.createTickets(
                order.event._id.toString(),
                order.mail,
                order.price,
                order.serviceFee,
                callbackModel,
                order.quantity
            )
        }
    }
}
