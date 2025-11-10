
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async init(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    // Tap Sandbox init: create a charge or payment URL
    const payload = {
      merchant: { id: process.env.TAP_MERCHANT_ID || undefined },
      amount: order.total / 100,
      currency: 'SAR',
      description: `Magellan Order ${order.id}`,
      threeDSecure: true,
      receipt: { email: false, sms: false },
      customer_initiated: true,
      source: { id: 'src_all' },
      supported_schemes: ['MADA','APPLEPAY','VISA','MASTERCARD'],
      payment_agreement: { contract: 'ONETIME' },
      metadata: { platform: 'Magellan' }, // Tap sandbox universal source for testing
      post: { url: process.env.TAP_WEBHOOK_URL || 'https://example.com/post' },
      redirect: { url: process.env.TAP_REDIRECT_URL || 'https://example.com/redirect' }
    };

    const res = await axios.post('https://api.tap.company/v2/charges', payload, {
      headers: {
        'Authorization': `Bearer ${process.env.TAP_SECRET || 'sk_test'}`,
        'Content-Type': 'application/json'
      }
    });

    // Save a pending payment
    await this.prisma.payment.upsert({
      where: { orderId },
      update: { status: 'PENDING', provider: 'TAP', amount: order.total, currency: 'SAR' },
      create: { orderId, provider: 'TAP', status: 'PENDING', amount: order.total, currency: 'SAR' }
    });

    return res.data; // contains transaction url in res.data.transaction.url
  }
}
