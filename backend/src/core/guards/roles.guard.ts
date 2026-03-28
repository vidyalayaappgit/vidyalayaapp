import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@core/decorators/roles.decorator';

interface AuthUser {
  userId: number;
  role_id: number;
  userCode?: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.getAllAndOverride<number[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // ✅ No roles required → allow
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.debug(
        `No role restriction → ${request?.method} ${request?.url}`,
      );
      return true;
    }

    const user = request.user as AuthUser;

    if (!user) {
      this.logger.warn('User not found in request');
      throw new ForbiddenException('User not found');
    }

    const hasRole = requiredRoles.includes(user.role_id);

    if (!hasRole) {
      this.logger.warn(
        `Role denied → user:${user.userId}, role:${user.role_id}`,
      );
      throw new ForbiddenException('Insufficient role');
    }

    this.logger.debug(
      `Role granted → user:${user.userId}, role:${user.role_id}`,
    );

    return true;
  }
}