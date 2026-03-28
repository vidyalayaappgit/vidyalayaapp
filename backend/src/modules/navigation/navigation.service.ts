import { Injectable } from '@nestjs/common';

import { PostgresService } from '@core/database/postgres.service';

@Injectable()
export class NavigationService {
  constructor(
    private readonly db: PostgresService,
  ) {}

  async getNavigation(roleId: number) {
    const result = await this.db.query<{ navigation: any }>(
      `SELECT fn_get_navigation($1) AS navigation`,
      [roleId],
    );

    return result.rows[0]?.navigation ?? [];
  }
}