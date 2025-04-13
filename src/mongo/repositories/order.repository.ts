import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Order, OrderDocument} from "../schemas/order.schema";
import {OrderModel} from "../models/order.model";

@Injectable()
export class OrderRepository {
    constructor(@InjectModel(Order.name) private model: Model<Order>) {
    }

    async create(order: OrderModel): Promise<OrderModel>{
        const newOrder: OrderDocument = await new this.model(order).save();
        return OrderModel.fromDoc(newOrder);
    }

    async getById(id: string): Promise<OrderModel> {
        const order: OrderDocument = await this.model.findById(id).populate('event').exec();
        return OrderModel.fromDoc(order)
    }

    async update(id: string, order: Partial<OrderModel>): Promise<OrderModel>{
        const updated = await this.model.findByIdAndUpdate(id, order, { new: true }).exec();
        return OrderModel.fromDoc(updated);
    }

    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id).exec();
    }

    async deletePayed(): Promise<void> {
        await this.model.deleteMany({ payed: true }).exec();
    }

    async cleanUp(eventId: string){
        await this.model.deleteMany({ event: eventId }).exec();
    }
}