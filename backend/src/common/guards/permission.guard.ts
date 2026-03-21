import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  PermissionConfig
} from '../decorators/permissions.decorator';
import { PostgresService } from 'src/database/postgres.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private db: PostgresService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const permission = this.reflector.getAllAndOverride<PermissionConfig>(
      PERMISSIONS_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // ✅ No permission required → allow
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // ✅ FINAL USER CONTEXT (from JWT)
    const { userId, schoolId, schoolGroupId } = user;

    const { pageId, formId, controlCode } = permission;

    // 🔥 FINAL ENTERPRISE QUERY
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
        controlCode // 'save', 'view', 'delete'
      ]
    );
console.log('user: ',userId,' school_id: ',schoolId,' school_group_id: ',schoolGroupId,' page_id: ',pageId,' form_id: ',formId, ' control_code: ',controlCode)
    if (result.rowCount === 0) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}