import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
  ) {}

  async placeOrder(
    userId: number,
    fullName: string,
    phone: string,
    address: string,
  ): Promise<Order> {
    // Get user's cart
    const cart = await this.cartService.getOrCreateCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    // Create order
    const newOrder = this.ordersRepository.create({
      userId,
      totalAmount,
      fullName,
      phone,
      address,
    });
    const savedOrder = await this.ordersRepository.save(newOrder);

    // Create order items
    for (const cartItem of cart.items) {
      const orderItem = this.orderItemsRepository.create({
        orderId: savedOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtPurchase: cartItem.product.price,
      });
      await this.orderItemsRepository.save(orderItem);
    }

    // Clear cart after order
    await this.cartService.clearCart(userId);

    const order = await this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product'],
    });
    return order!;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
  async getSellerOrders(sellerId: number): Promise<Order[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .where('product.sellerId = :sellerId', { sellerId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();

    return orders;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.getOrderById(orderId);
    order.status = status as any;
    return this.ordersRepository.save(order);
  }
}
