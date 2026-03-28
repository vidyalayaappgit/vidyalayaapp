import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  PermissionConfig,
} from '@core/decorators/permissions.decorator';
import { PostgresService } from '@core/database/postgres.service';

interface AuthUser {
  userId: number;
  schoolId: number;
  schoolGroupId: number;
  userCode?: string;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private reflector: Reflector,
    private db: PostgresService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 🔹 Get permission metadata
    const permission = this.reflector.getAllAndOverride<PermissionConfig>(
      PERMISSIONS_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // ✅ No permission required → allow
    if (!permission) {
      this.logger.debug(
        `No permission required: ${request?.method} ${request?.url}`,
      );
      return true;
    }

    const user = request.user as AuthUser;

    if (!user) {
      this.logger.warn('User not found in request');
      throw new ForbiddenException('User not found');
    }

    const { userId, schoolId, schoolGroupId } = user;
    const { pageId, formId, controlCode } = permission;

    this.logger.debug(
      `Permission check → user:${userId}, page:${pageId}, form:${formId}, control:${controlCode}`,
    );

    try {
      const result = await this.db.query(
        `
        SELECT 1
        FROM user_school_roles usr

        JOIN role_page_access rpa
          ON usr.role_id = rpa.role_id
         AND usr.school_group_id = rpa.school_group_id

        JOIN role_form_control_access rfca
          ON usr.role_id = rfca.role_id
         AND usr.school_group_id = rfca.school_group_id

        JOIN controls c
          ON rfca.control_id = c.id

        WHERE usr.user_id = $1
          AND usr.school_id = $2
          AND usr.school_group_id = $3

          -- ✅ Page access
          AND rpa.page_id = $4
          AND rpa.can_access = true

          -- ✅ Form + Control access
          AND rfca.form_id = $5
          AND LOWER(c.control_code) = LOWER($6)
          AND rfca.can_access = true

        LIMIT 1
        `,
        [
          userId,
          schoolId,
          schoolGroupId,
          pageId,
          formId,
          controlCode,
        ],
      );

      if (result.rowCount === 0) {
        this.logger.warn(
          `Access denied → user:${userId}, control:${controlCode}`,
        );
        throw new ForbiddenException('Access Denied');
      }

      this.logger.debug(
        `Access granted → user:${userId}, control:${controlCode}`,
      );

      return true;

    } catch (error) {
      this.logger.error(
        `Permission check failed → user:${userId}`,
        error,
      );
      throw error;
    }
  }
}