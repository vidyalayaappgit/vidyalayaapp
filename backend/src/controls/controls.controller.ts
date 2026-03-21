import { Controller, Get, Param, Req } from '@nestjs/common';
import { ControlsService } from './controls.service';

@Controller('controls')
export class ControlsController {

  constructor(private controlsService: ControlsService) {}

  @Get(':pageId')
  async getControls(
    @Param('pageId') pageId: number,
    @Req() req: any
  ) {

    const roleId = req.user.role_id;

    return this.controlsService.getPageControls(
      roleId,
      pageId
    );

  }

}