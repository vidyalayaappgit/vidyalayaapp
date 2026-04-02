import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PostgresService } from '@core/database/postgres.service';

interface LoginResponse {
  error_id: number;
  error_message: string;
  user: {
    id: number;
    user_code: string;
  };
  role?: {
    role_id: number;
    role_code: string;
  };
  school?: {
    school_id: number;
    school_group_id: number;
    school_code: string;
  };
  role_id?: number;
  role_code?: string;
  school_id?: number;
  school_group_id?: number;
  school_code?: string;
}

interface JwtPayload {
  user_id: number;
  user_code: string;
  role_id: number;
  school_id: number;
  school_group_id: number;
}

type LooseObject = Record<string, unknown>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private db: PostgresService,
    private jwtService: JwtService,
  ) {}

  async login(
    groupCode: string,
    userCode: string,
    password: string,
  ) {
    try {
      const result = await this.db.query<{ data: LoginResponse }>(
        `SELECT fn_login_user($1,$2,$3) AS data`,
        [groupCode, userCode, password],
      );

      const response = result.rows?.[0]?.data;

      if (!response || response.error_id !== 0) {
        this.logger.warn(
          `Login failed -> user:${userCode}, reason:${response?.error_message}`,
        );

        throw new UnauthorizedException(
          response?.error_message || 'Login failed',
        );
      }

      const { user } = response;
      const rawRole = (response.role ?? response) as LooseObject;
      const rawSchool = (response.school ?? response) as LooseObject;
      const role = {
        role_id: Number(
          rawRole['role_id'] ?? rawRole['id'] ?? response.role_id ?? 0,
        ),
        role_code: String(
          rawRole['role_code'] ??
            rawRole['code'] ??
            rawRole['role_name'] ??
            response.role_code ??
            `ROLE_${String(rawRole['role_id'] ?? rawRole['id'] ?? response.role_id ?? 0)}`,
        ),
      };
      const school = {
        school_id: Number(
          rawSchool['school_id'] ?? rawSchool['id'] ?? response.school_id ?? 0,
        ),
        school_group_id: Number(
          rawSchool['school_group_id'] ??
            rawSchool['group_id'] ??
            response.school_group_id ??
            0,
        ),
        school_code: String(
          rawSchool['school_code'] ??
            rawSchool['code'] ??
            rawSchool['school_name'] ??
            response.school_code ??
            `SCHOOL_${String(rawSchool['school_id'] ?? rawSchool['id'] ?? response.school_id ?? 0)}`,
        ),
      };

      this.logger.debug(
        `fn_login_user response keys: ${Object.keys(response).join(', ')}`,
      );
      this.logger.log(`fn_login_user role payload: ${JSON.stringify(response.role ?? null)}`);
      this.logger.log(`fn_login_user school payload: ${JSON.stringify(response.school ?? null)}`);

      const payload: JwtPayload = {
        user_id: user.id,
        user_code: user.user_code,
        role_id: role.role_id,
        school_id: school.school_id,
        school_group_id: school.school_group_id,
      };

      const token = await this.jwtService.signAsync(payload);

      this.logger.log(
        `Login Success -> user:${user.user_code}, role:${role.role_id}, school:${school.school_id}`,
      );

      return {
        success: true,
        access_token: token,
        user,
        context: {
          role,
          school,
        },
      };
    } catch (error) {
      this.logger.error(`Login error -> user:${userCode}`, error);
      throw error;
    }
  }
}
