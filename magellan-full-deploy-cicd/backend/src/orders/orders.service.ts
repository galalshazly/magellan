
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private notif: NotificationsService, private rt: RealtimeGateway) {}

  async createOrder(dto: any, userId: string) {
    // dto: { items: [{itemId, quantity, optionsJson}], addressId?, deliveryType }
    const items = await Promise.all(dto.items.map(async (it: any) => {
      const item = await this.prisma.menuItem.findUnique({ where: { id: it.itemId }, include: { optionGroups: { include: { options: true } } } });
      if (!item) throw new Error('Item not found');
      // compute price
      let price = item.basePrice;
      if (it.optionsJson && it.optionsJson.selected) {
        for (const sel of it.optionsJson.selected) {
          // sel = {groupId, optionId}
          const opt = item.optionGroups.flatMap(g => g.options).find(o => o.id === sel.optionId);
          if (opt) price += opt.priceDelta;
        }
      }
      const totalForLine = price * (it.quantity || 1);
      return { nameAr: item.nameAr, nameEn: item.nameEn, basePrice: price, quantity: it.quantity || 1, itemId: item.id, optionsJson: it.optionsJson || {} , totalForLine};
    }));

    const subtotal = items.reduce((s,it)=> s + it.totalForLine, 0);
    const deliveryFee = dto.deliveryType === 'PICKUP' ? 0 : 1200; // SAR 12.00 default
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    const order = await this.prisma.order.create({
      data: {
        userId, subtotal, deliveryFee, discount, total, deliveryType: dto.deliveryType || 'DELIVERY',
        items: { create: items.map(({totalForLine, ...rest}) => rest) }
      },
      include: { items: true }
    });

    await this.notif.notifyUser(userId, `Order ${order.id} created. Total: ${total/100} SAR`);
    return order;
  }

  myOrders(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.update({ where: { id }, data: { status } });
    await this.notif.notifyUser(order.userId, `Order ${order.id} is now ${status}`);
    this.rt.broadcastOrderStatus(id, status);
    return order;
  }

  async markPaid(orderId: string, providerRef: string) {
    await this.prisma.payment.upsert({
      where: { orderId },
      update: { status: PaymentStatus.PAID, providerRef },
      create: { orderId, provider: 'TAP', status: PaymentStatus.PAID, amount: 0, currency: 'SAR', providerRef }
    });
    const order = await this.prisma.order.update({ where: { id: orderId }, data: { status: OrderStatus.CONFIRMED } });
    await this.notif.notifyUser(order.userId, `Order ${order.id} payment confirmed.`);
    return order;
  }
}
