
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const authz = req.headers['authorization'];
    if (!authz) throw new UnauthorizedException();
    const token = (authz as string).replace('Bearer ', '');
    try {
      const payload = await this.auth.verifyJwt(token);
      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
