export class LiqPayCallbackModel {
    transactionId: number;
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    senderFirstName: string;
    senderLastName: string;
    receiverCommission: number;
    senderCommission: number;
    agentCommission: number;

    constructor(data: Partial<LiqPayCallbackModel>) {
        Object.assign(this, data);
    }

    static fromLiqPayCallback(data: any): LiqPayCallbackModel {
        return new LiqPayCallbackModel({
            transactionId: data.transaction_id,
            orderId: data.order_id,
            status: data.status,
            amount: data.amount,
            currency: data.currency,
            senderFirstName: data.sender_first_name,
            senderLastName: data.sender_last_name,
            receiverCommission: data.receiver_commission,
            senderCommission: data.sender_commission,
            agentCommission: data.agent_commission
        });
    }
}
