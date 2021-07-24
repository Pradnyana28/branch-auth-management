import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { addMonths, subDays } from 'date-fns';
import { ServiceHelper } from 'src/common/ServiceHelper';

@Injectable()
export class AuthService extends ServiceHelper {
  constructor(
    @Inject('USER_CLIENT') protected readonly client: ClientProxy,
    protected readonly jwtService: JwtService,
  ) {
    super();
  }

  async validateUser(username: string, password: string): Promise<any> {
    Logger.debug('START validating user to login', { username });

    try {
      const user = await this.call({ role: 'user', cmd: 'get' }, { username });

      if (!user) {
        Logger.debug('User Not Found');
        throw new UnauthorizedException('Username or password is incorrect');
      }

      if (!compareSync(password, user?.password)) {
        Logger.debug('Password doesnt match');
        throw new UnauthorizedException('Username or password is incorrect');
      }

      return this.hideSensitiveData(user);
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user) {
    const today = Date.now();
    const accessTokenExpiredAt = addMonths(today, 1);
    const refreshTokenExpiredAt = subDays(accessTokenExpiredAt, 2); // will expired 2 days before access token expiration
    const accessTokenPayload = { userAttributes: user, accessTokenExpiredAt };
    const refreshTokenPayload = {
      userAttributes: user,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    };

    Logger.debug('AUTH PAYLOAD', accessTokenPayload);
    return {
      userId: user._id,
      accessToken: this.jwtService.sign(accessTokenPayload),
      accessTokenExpiredAt,
      refreshToken: this.jwtService.sign(refreshTokenPayload),
      refreshTokenExpiredAt,
    };
  }

  async registerUser(user) {
    Logger.debug('START registering new user');

    try {
      const insertResult = await this.call(
        { role: 'user', cmd: 'create' },
        user,
      );

      Logger.debug('RESPONSE', insertResult);
      if (insertResult.error) {
        return insertResult.error;
      }

      return insertResult;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }
}
