
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('request-otp')
  requestOtp(@Body() body: { phone: string }) {
    return this.auth.requestOtp(body.phone);
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { phone: string, code: string, name?: string }) {
    return this.auth.verifyOtp(body.phone, body.code, body.name);
  }
}
