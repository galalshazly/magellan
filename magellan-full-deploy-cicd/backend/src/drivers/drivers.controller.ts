
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('driver')
export class DriversController {
  constructor(private readonly drv: DriversService) {}

  @UseGuards(JwtGuard)
  @Post('location')
  loc(@Body() body: { orderId: string, lat: number, lng: number }, @Req() req: any) {
    const driverId = req.user.sub;
    return this.drv.updateLocation(driverId, body.orderId, body.lat, body.lng);
  }
}
