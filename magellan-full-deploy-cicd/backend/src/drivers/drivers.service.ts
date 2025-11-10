
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService, private rt: RealtimeGateway) {}

  async updateLocation(driverId: string, orderId: string, lat: number, lng: number) {
    this.rt.broadcastOrderLocation(orderId, lat, lng);
    return { ok: true };
  }
}
