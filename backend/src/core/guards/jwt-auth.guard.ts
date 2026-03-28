import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '@core/decorators/public.decorator';

interface AuthUser {
  user_id: number;
  role_id: number;
  school_id: number;
  school_group_id: number;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      this.logger.debug(
        `Public route → ${request?.method} ${request?.url}`,
      );
      return true;
    }

    this.logger.debug(
      `Protected route → ${request?.method} ${request?.url}`,
    );

    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  override handleRequest<TUser = unknown>(
    err: unknown,
    user: unknown,
    info: { message?: string } | undefined,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest<Request>();

    const typedUser = user as AuthUser;

    if (err || !typedUser) {
      this.logger.warn(
        `Unauthorized → ${request?.method} ${request?.url} | reason: ${
          info?.message ?? 'Unknown'
        }`,
      );

      throw err || new UnauthorizedException('Unauthorized');
    }

    this.logger.debug(
      `Authenticated → ${typedUser.user_id}`,
    );

    return typedUser as unknown as TUser;
  }
}