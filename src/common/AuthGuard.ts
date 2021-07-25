import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isAfter } from 'date-fns';
import { Request } from 'express';

interface ITokenPayload {
  userAttr;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    switch (context.getType()) {
      case 'rpc':
        return true;

      default: {
        const req = context.switchToHttp().getRequest<Request>();

        try {
          const today = Date.now();
          const payload = this.jwtService.verify(req.headers['authorization']);
          const expirationDate = new Date(payload.expirationDate);
          // Check if token is expired
          if (isAfter(today, expirationDate)) {
            return false;
          }
          (req as any).user = payload.userAttributes;
          return true;
        } catch (err) {
          Logger.error(err);
          return false;
        }
      }
    }
  }
}
