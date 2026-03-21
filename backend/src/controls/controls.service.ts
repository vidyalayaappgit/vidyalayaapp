import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';

@Injectable()
export class ControlsService {

  constructor(private db: PostgresService) {}

  async getPageControls(roleId: number, pageId: number) {

    const result = await this.db.query(
      `SELECT fn_get_form_controls($1,$2) AS controls`,
      [roleId,pageId]
    );

    return result.rows[0].controls;

  }

}