import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';
import { Logger } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy, 'local') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload) {
    Logger.debug('VALIDATE_TOKEN', payload);
    return { id: payload.sub, user: payload.user };
  }
}
