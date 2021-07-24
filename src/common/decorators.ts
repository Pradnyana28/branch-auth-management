import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export const ApiAuthenticated = createParamDecorator(
  (jwtService: JwtService, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization'];
    return jwtService.verify(token);
  },
);
