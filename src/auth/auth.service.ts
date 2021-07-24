import {
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    Logger.debug('START validating user to login', { username });

    try {
      const user = await firstValueFrom(
        this.client.send({ role: 'user', cmd: 'get' }, { username }).pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        ),
      );

      if (!user) {
        Logger.debug('No user found');
        return null;
      }

      if (compareSync(password, user?.password)) {
        return user;
      }
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user) {
    const payload = { user, sub: user.id };

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerUser(user) {
    Logger.debug('START registering new user');

    try {
      const insertResult = await firstValueFrom(
        this.client.send({ role: 'user', cmd: 'create' }, user).pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        ),
      );

      Logger.debug('RESPONSE', insertResult);

      return insertResult;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }
}
