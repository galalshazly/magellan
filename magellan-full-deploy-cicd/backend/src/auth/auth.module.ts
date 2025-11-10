
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [JwtModule.registerAsync({
    useFactory: () => ({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' }
    })
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
