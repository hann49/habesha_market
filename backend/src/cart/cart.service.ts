import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId });
      await this.cartRepository.save(cart);
      cart.items = [];
    }

    return cart;
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    // Check if product already in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: {
        cartId: cart.id,
        productId: addToCartDto.productId,
      },
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += addToCartDto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getOrCreateCart(userId);
  }

  async updateCartItem(
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = updateCartItemDto.quantity;
    return this.cartItemRepository.save(item);
  }

  async removeCartItem(itemId: number): Promise<{ message: string }> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(item);
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: number): Promise<{ message: string }> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id });
    return { message: 'Cart cleared' };
  }
}
