import { Injectable, Logger } from '@nestjs/common';

import { PostgresService } from '@core/database/postgres.service';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);

  constructor(
    private readonly db: PostgresService,
  ) {}

  async getNavigation(roleId: number) {
    const result = await this.db.query<{ navigation: any }>(
      `SELECT fn_get_navigation($1) AS navigation`,
      [roleId],
    );

    const navigation = result.rows[0]?.navigation ?? [];

    this.logger.log(
      `fn_get_navigation(${roleId}) returned ${Array.isArray(navigation) ? navigation.length : 'non-array'} items`,
    );
    this.logger.debug(
      `Navigation payload preview: ${JSON.stringify(navigation).slice(0, 500)}`,
    );

    return navigation;
  }
}
