import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppModule } from '../app.module';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should successfully login with correct params provided', async () => {
    const result = {
      userId: 'userId',
      accessToken: 'accessToken',
      accessTokenExpiredAt: new Date(),
      refreshToken: 'refreshToken',
      refreshTokenExpiredAt: new Date(),
    };
    const payload = {
      username: 'username',
      password: 'password',
    };

    jest
      .spyOn(authService, 'login')
      .mockImplementation(() => Promise.resolve(result));

    expect(await authController.login({}, payload)).toBe(result);
  });

  it('should successfully register with correct parameters', async () => {
    const result = {
      username: 'username',
      email: 'email',
    };
    const payload = {
      username: 'username',
      email: 'email',
      name: 'name',
    };

    jest
      .spyOn(authService, 'registerUser')
      .mockImplementation(() => Promise.resolve(result));

    expect(await authController.register({}, payload)).toBe(result);
  });

  it('should successfully refresh access token', async () => {
    const result = {
      userId: 'userId',
      accessToken: 'accessToken',
      accessTokenExpiredAt: new Date(),
      refreshToken: 'refreshToken',
      refreshTokenExpiredAt: new Date(),
    };
    const payload = {};

    jest
      .spyOn(authService, 'extendToken')
      .mockImplementation(() => Promise.resolve(result));

    expect(await authController.refresh(payload)).toBe(result);
  });
});
