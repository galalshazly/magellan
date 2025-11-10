
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';

const otpStore = new Map<string, { code: string, expires: number }>(); // phone -> otp

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async requestOtp(phone: string) {
    const code = (Math.floor(100000 + Math.random()*900000)).toString();
    otpStore.set(phone, { code, expires: Date.now() + 5*60*1000 });
    console.log('OTP for', phone, 'is', code);
    return { ok: true };
  }

  async verifyOtp(phone: string, code: string, name?: string) {
    const entry = otpStore.get(phone);
    if (!entry || entry.code != code || entry.expires < Date.now()) throw new UnauthorizedException('Invalid OTP');
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone, name: name || 'عميل', passwordHash: await argon2.hash(code) }});
    }
    const payload = { sub: user.id, role: user.role };
    const token = await this.jwt.signAsync(payload);
    const refresh = await this.jwt.signAsync(payload, { expiresIn: '30d' });
    return { token, refresh, user };
  }

  async verifyJwt(token: string) {
    return this.jwt.verifyAsync(token, { secret: process.env.JWT_SECRET || 'dev-secret' });
  }
}
