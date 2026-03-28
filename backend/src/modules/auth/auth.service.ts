import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PostgresService } from '@core/database/postgres.service';
import { JwtService } from '@nestjs/jwt';

interface LoginResponse {
  error_id: number;
  error_message: string;
  user: {
    id: number;
    user_code: string;
  };
  role: {
    role_id: number;
    role_code: string;
  };
  school: {
    school_id: number;
    school_group_id: number;
    school_code: string;
  };
}

interface JwtPayload {
  user_id: number;
  user_code: string;
  role_id: number;
  school_id: number;
  school_group_id: number;
}

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
      // 🔹 Call DB function
      const result = await this.db.query<{ data: LoginResponse }>(
        `SELECT fn_login_user($1,$2,$3) AS data`,
        [groupCode, userCode, password],
      );

      const response = result.rows?.[0]?.data;

      // ❌ Login failed
      if (!response || response.error_id !== 0) {
        this.logger.warn(
          `Login failed → user:${userCode}, reason:${response?.error_message}`,
        );

        throw new UnauthorizedException(
          response?.error_message || 'Login failed',
        );
      }

      const { user, role, school } = response;

      // 🔹 JWT Payload (aligned with guards)
        const payload : JwtPayload = {
          user_id: user.id,
          user_code: user.user_code,
          role_id: role.role_id,              // 🔥 FIX
          school_id: school.school_id,
          school_group_id: school.school_group_id,
        };

      // 🔹 Generate Token
      const token = await this.jwtService.signAsync(payload);

      // 🔹 Logging (structured)
      this.logger.log(
        `Login Success → user:${user.user_code}, role:${role?.role_code}, school:${school?.school_code}`,
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
      this.logger.error(
        `Login error → user:${userCode}`,
        error,
      );
      throw error;
    }
  }
}