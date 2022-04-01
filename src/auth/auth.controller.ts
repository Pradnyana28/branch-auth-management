import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/LocalAuthGuard';
import { AuthGuard } from 'src/common/AuthGuard';
import { UserSession } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() req, @Body() payload) {
    Logger.debug('START loggin in user', { username: payload.username });
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Request() req, @Body() payload) {
    Logger.debug('START registering new user', {
      username: payload.username,
      email: payload.email,
    });
    return this.authService.registerUser(payload);
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  async refresh(@UserSession() user: any) {
    return this.authService.extendToken(user);
  }
}
