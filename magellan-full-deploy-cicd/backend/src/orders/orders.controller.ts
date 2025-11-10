
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // NOTE: userId is mocked here; in production use AuthGuard/JWT
  private mockUserId() { return 'demo-user-id'; }

  @Post()
  create(@Body() dto: any) {
    return this.orders.createOrder(dto, this.mockUserId());
  }

  @Get('my')
  mine() { return this.orders.myOrders(this.mockUserId()); }

  @Get(':id')
  get(@Param('id') id: string) { return this.orders.get(id); }

  @Patch(':id/status')
  status(@Param('id') id: string, @Body() body: { status: OrderStatus }) {
    return this.orders.updateStatus(id, body.status);
  }
}
