import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AppModule } from '../app.module';
import { genSalt, hash } from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let salt: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);

    salt = await genSalt(10);
  });

  it('should successfully validate user', async () => {
    const password = await hash('password', salt);
    const result = {
      username: 'username',
      password,
    };
    jest
      .spyOn(authService, 'call')
      .mockImplementation(() => Promise.resolve(result));

    expect(
      await authService.validateUser(result.username, 'password'),
    ).toStrictEqual({
      username: result.username,
    });
  });
});
