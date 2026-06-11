import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('seller')
  @UseGuards(JwtAuthGuard)
  getSellerOrders(@Request() req) {
    return this.ordersService.getSellerOrders(req.user.id);
  }

  @Get('buyer')
  @UseGuards(JwtAuthGuard)
  getBuyerOrders(@Request() req) {
    return this.ordersService.getBuyerOrders(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateOrderStatus(
      id,
      body.status as 'pending' | 'shipped' | 'delivered' | 'cancelled',
    );
  }
}
