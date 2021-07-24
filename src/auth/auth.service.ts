import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { ServiceHelper } from 'src/common/ServiceHelper';

@Injectable()
export class AuthService extends ServiceHelper {
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
    const accessTokenPayload = { userAttributes: user };
    Logger.debug('AUTH_PAYLOAD', accessTokenPayload);
    return this.generateToken(user._id, accessTokenPayload);
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
