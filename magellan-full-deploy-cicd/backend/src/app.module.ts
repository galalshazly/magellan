
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { DriversModule } from './drivers/drivers.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [DriversModule, RealtimeModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), MenuModule, OrdersModule, PaymentsModule, NotificationsModule],
  providers: [PrismaService],
  controllers: [AdminController],
})
export class AppModule {}
