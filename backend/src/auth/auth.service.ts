import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private logger = new Logger(AuthService.name);

  constructor(
    private db: PostgresService,
    private jwtService: JwtService
  ) {}

  async login(groupCode: string, userCode: string, password: string) {
// console.log("LOGIN INPUT:", groupCode, userCode, password);
    const result = await this.db.query(
      `SELECT fn_login_user($1,$2,$3) AS data`,
      [groupCode, userCode, password]
    );

    const response = result.rows?.[0]?.data;

    if (!response || response.error_id !== 0) {
      throw new UnauthorizedException(
        response?.error_message || 'Login failed'
      );
    }

    const user = response.user;
    const role = response.role;
    const school = response.school;
  

    const payload = {
      user_id: user.id,
      school_group_id: school?.school_group_id,
      role_id: role?.role_id,
      school_id: school?.school_id
    };

    
    const token = await this.jwtService.signAsync(payload);

    this.logger.log(
      `Login Success: ${user.user_code} | Role: ${role?.role_code} | School: ${school?.school_code}`
    );
//  console.log('user: ',user.id,' school_group_id: ',user.school_group_id)

// console.log(JSON.stringify(response, null, 2));

    return {
      success: true,
      access_token: token,
      user,
      context: {
        role,
        school
      }
    };
  }

}