
import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService, private readonly orders: OrdersService) {}

  @Post(':orderId/init')
  init(@Param('orderId') orderId: string) {
    return this.payments.init(orderId);
  }

  // Tap webhook (sandbox)
  @Post('webhook')
  async webhook(@Body() body: any, @Req() req: any) {
    // Basic validation omitted; verify signature in production
    if (body?.status === 'CAPTURED' && body?.reference?.order) {
      const orderId = body.reference.order;
      await this.orders.markPaid(orderId, body.id || 'tap_ref');
      return { ok: true };
    }
    return { ok: true };
  }
}
