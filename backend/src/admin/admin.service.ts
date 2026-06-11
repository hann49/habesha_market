import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getStats() {
    const totalUsers = await this.usersRepository.count();
    const totalProducts = await this.productsRepository.count();
    const totalOrders = await this.ordersRepository.count();

    const orders = await this.ordersRepository.find();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number((order as any).totalAmount),
      0,
    );

    const pendingOrders = await this.ordersRepository.count({
      where: { status: 'pending' as any },
    });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
    };
  }

  async getAllUsers() {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteUser(id: number) {
    await this.usersRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async updateUserRole(id: number, role: string) {
    await this.usersRepository.update(id, { role: role as any });
    return { message: 'User role updated successfully' };
  }

  async getAllProducts() {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async deleteProduct(id: number) {
    await this.productsRepository.delete(id);
    return { message: 'Product deleted successfully' };
  }

  async getAllOrders() {
    return this.ordersRepository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }
}
