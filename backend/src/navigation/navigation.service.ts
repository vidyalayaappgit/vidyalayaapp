import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';

@Injectable()
export class NavigationService {

  constructor(private db: PostgresService) {}

  async getNavigation(role_id: number) {

    const result = await this.db.query(
      `SELECT fn_get_navigation($1) AS navigation`,
      [role_id]
    );

    return result.rows[0].navigation;

  }

}