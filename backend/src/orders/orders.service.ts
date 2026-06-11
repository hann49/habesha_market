import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async getSellerOrders(sellerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { sellerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getBuyerOrders(buyerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { buyerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(
    id: number,
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled',
  ): Promise<Order> {
    const order = await this.getOrderById(id);
    order.status = status;
    return this.ordersRepository.save(order);
  }

  async createOrder(
    buyerId: number,
    sellerId: number,
    items: { productId: number; quantity: number }[],
    shippingAddress: string,
    phoneNumber: string,
  ): Promise<Order> {
    const order = new Order();
    order.buyerId = buyerId;
    order.sellerId = sellerId;
    order.shippingAddress = shippingAddress;
    order.phoneNumber = phoneNumber;
    order.status = 'pending';
    order.totalPrice = 0;

    // Calculate total
    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) throw new BadRequestException('Product not found');
      if (product.stock < item.quantity)
        throw new BadRequestException('Insufficient stock');

      order.totalPrice += Number(product.price) * item.quantity;
    }

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      const orderItem = new OrderItem();
      orderItem.orderId = savedOrder.id;
      orderItem.productId = product.id;
      orderItem.quantity = item.quantity;
      orderItem.priceAtPurchase = product.price;

      await this.orderItemsRepository.save(orderItem);

      // Reduce product stock
      await this.productsService.updateStock(
        product.id,
        product.stock - item.quantity,
      );
    }

    return this.getOrderById(savedOrder.id);
  }
}
