import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'local') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yoursecret',
    });
  }

  async validate(payload) {
    return { id: payload.sub, user: payload.user };
  }
}
