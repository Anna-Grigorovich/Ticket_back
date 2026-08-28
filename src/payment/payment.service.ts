import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import {OrderModel} from "../mongo/models/order.model";
import {PaymentData} from "./interfaces/payment-data.interface";
import {LiqPayCallbackModel} from "../mongo/models/payment-result.model";
import {roundPrice} from "../utils/number-util";

@Injectable()
export class PaymentService implements OnModuleInit {
    private publicKey: string;
    private privateKey: string;
    private rroItemId: string;
    private readonly logger = new Logger(PaymentService.name);
    private readonly host = 'https://www.liqpay.ua/api/';
    private readonly buttonText = 'Сплатити';

    constructor(private configService: ConfigService) {}

    onModuleInit(): void {
        this.publicKey = this.configService.get<string>('LIQ_PUBLIC');
        this.privateKey = this.configService.get<string>('LIQ_PRIVATE');
        this.rroItemId = this.configService.get<string>('LIQ_RRO_ITEM_ID');
        if (!this.rroItemId) {
            this.logger.warn('LIQ_RRO_ITEM_ID is not set, payments will not be fiscalized');
        }
    }

    private buildRroInfo(order: OrderModel): Record<string, any> {
        const rroInfo: Record<string, any> = { delivery_emails: [order.mail] };
        if (!this.rroItemId) return rroInfo;

        const price = roundPrice(order.price + order.serviceFee);
        rroInfo.items = [{
            id: this.rroItemId,
            price,
            amount: order.quantity,
            cost: roundPrice(price * order.quantity)
        }];
        return rroInfo;
    }

    private strToSign(str: string): string {
        return crypto.createHash('sha1').update(str).digest('base64');
    }

    private validateParams(params: Record<string, any>): Record<string, any> {
        params.public_key = this.publicKey;
        params.language = 'uk'; // Force Ukrainian language

        if (!params.version) throw new Error('version is null');
        if (typeof params.version === 'string' && !isNaN(Number(params.version))) {
            params.version = Number(params.version);
        } else if (typeof params.version !== 'number') {
            throw new Error('version must be a number or a string convertible to a number');
        }

        if (!params.amount) throw new Error('amount is null');
        if (typeof params.amount === 'string' && !isNaN(Number(params.amount))) {
            params.amount = Number(params.amount);
        } else if (typeof params.amount !== 'number') {
            throw new Error('amount must be a number or a string convertible to a number');
        }

        ['action', 'currency', 'description'].forEach((param) => {
            if (params[param] && typeof params[param] !== 'string') {
                params[param] = String(params[param]);
            } else if (!params[param]) {
                throw new Error(`${param} is null or not provided`);
            }
        });

        return params;
    }

    async makeApiRequest(path: string, params: Record<string, any>): Promise<any> {
        if (!params.version) throw new Error('version is null');

        params.public_key = this.publicKey;
        const data = Buffer.from(JSON.stringify(params)).toString('base64');
        const signature = this.strToSign(this.privateKey + data + this.privateKey);

        const dataToSend = new URLSearchParams();
        dataToSend.append('data', data);
        dataToSend.append('signature', signature);

        try {
            const response = await axios.post(this.host + path, dataToSend, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    generatePaymentForm(params: Record<string, any>): string {
        params = this.validateParams(params);

        const data = Buffer.from(JSON.stringify(params)).toString('base64');
        const signature = this.strToSign(this.privateKey + data + this.privateKey);

        return `
      <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
        <script src="https://static.liqpay.ua/libjs/sdk_button.js"></script>
        <sdk-button label="${this.buttonText}" background="#77CC5D" onClick="submit()"></sdk-button>
      </form>
    `;
    }

    generatePaymentObject(params: Record<string, any>): PaymentData {
        params = this.validateParams(params);
        const data = Buffer.from(JSON.stringify(params)).toString('base64');
        const signature = this.strToSign(this.privateKey + data + this.privateKey);
        return { data, signature };
    }

    verifyCallback(data: string, signature: string): boolean {
        const expectedSignature = this.strToSign(this.privateKey + data + this.privateKey);
        return expectedSignature === signature;
    }

    decodeData(data: string): LiqPayCallbackModel{
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        return LiqPayCallbackModel.fromLiqPayCallback(decodedData);
    }

    getPaymentForm(order: OrderModel){
        return this.generatePaymentForm({
            action: 'pay',
            amount: roundPrice(roundPrice(order.price + order.serviceFee) * order.quantity),
            currency: 'UAH',
            description: order.event.title,
            order_id: order._id,
            version: 3,
            server_url: `${this.configService.get('SERVER_URL')}/payment/callback`,
            result_url: `${this.configService.get('RESULT_URL')}/success`,
            rro_info: this.buildRroInfo(order)
        });
    }

    getPaymentData(order: OrderModel): PaymentData{
        return this.generatePaymentObject({
            action: 'pay',
            amount: roundPrice(roundPrice(order.price + order.serviceFee) * order.quantity),
            currency: 'UAH',
            description: order.event.title,
            order_id: order._id,
            version: 3,
            server_url: `${this.configService.get('SERVER_URL')}/payment/callback`,
            result_url: `${this.configService.get('RESULT_URL')}/success`,
            rro_info: this.buildRroInfo(order)
        });
    }
}
