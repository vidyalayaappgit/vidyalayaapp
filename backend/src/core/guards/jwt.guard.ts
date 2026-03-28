import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '@core/decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      this.logger.debug(
        `Public route: ${request.method} ${request.url}`,
      );
      return true;
    }

    return super.canActivate(context);
  }

override handleRequest<TUser = unknown>(
  err: unknown,
  user: TUser,
  _info: unknown,
  context: ExecutionContext,
): TUser {
  const request = context.switchToHttp().getRequest();

  if (err || !user) {
    this.logger.warn(
      `Unauthorized: ${request.method} ${request.url}`,
    );
    throw new UnauthorizedException();
  }

  return user;
}
}