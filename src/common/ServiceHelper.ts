import { Logger, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

export class ServiceHelper {
  protected readonly client: ClientProxy;
  protected readonly jwtService: JwtService;

  async call(commandKey: string | Record<string, unknown>, payload?: any) {
    Logger.log(`EMIT to '${JSON.stringify(commandKey)}'`);
    return await firstValueFrom(
      this.client.send(commandKey, payload).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );
  }

  async validateToken(token: string) {
    const isValid = await this.jwtService.verify(token);
    Logger.debug('VALIDATE_TOKEN', isValid);
    return isValid;
  }

  hideSensitiveData(data: any) {
    delete (data as any).password;
    delete (data as any).__v;
    return data;
  }
}
