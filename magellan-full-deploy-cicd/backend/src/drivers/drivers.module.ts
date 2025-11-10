
import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { PrismaService } from '../prisma.service';
import { RealtimeModule } from '../realtime/realtime.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RealtimeModule, AuthModule],
  controllers: [DriversController],
  providers: [DriversService, PrismaService],
})
export class DriversModule {}
