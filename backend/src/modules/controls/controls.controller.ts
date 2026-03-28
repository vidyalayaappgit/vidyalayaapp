import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { ControlsService } from '@modules/controls/controls.service';
import { JwtGuard } from '@core/guards/jwt.guard';

interface AuthUser {
  user_id: number;
  role_id: number;
  school_id: number;
  school_group_id: number;
}

@Controller('controls')
export class ControlsController {
  constructor(
    private readonly controlsService: ControlsService,
  ) {}

  @UseGuards(JwtGuard)
  @Get(':pageId')
  async getControls(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Req() req: Request,
  ) {
    const user = req.user as AuthUser;

    return this.controlsService.getPageControls(
      user.role_id,
      pageId,
    );
  }
}