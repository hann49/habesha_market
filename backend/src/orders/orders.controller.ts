import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  placeOrder(
    @Request() req: any,
    @Body() body: { fullName: string; phone: string; address: string },
  ) {
    return this.ordersService.placeOrder(
      req.user.id,
      body.fullName,
      body.phone,
      body.address,
    );
  }

  @Get()
  getUserOrders(@Request() req: any) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }
  @Get('seller/my-orders')
  getSellerOrders(@Request() req: any) {
    return this.ordersService.getSellerOrders(req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }
}