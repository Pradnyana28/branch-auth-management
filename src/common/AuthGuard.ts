import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    try {
      const payload = this.jwtService.verify(req.headers['authorization']);
      return payload.userAttributes;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}
