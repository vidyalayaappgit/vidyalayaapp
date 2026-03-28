import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtGuard } from '@core/guards/jwt.guard';
import { NavigationService } from '@modules/navigation/navigation.service';

interface AuthUser {
  user_id: number;
  role_id: number;
  school_id: number;
  school_group_id: number;
}

@Controller('navigation')
export class NavigationController {
  constructor(
    private readonly navigationService: NavigationService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async getNavigation(@Req() req: Request) {
    const user = req.user as AuthUser;

    const roleId = user.role_id;
     
    
 console.log("ROLE ID:", roleId);
    return this.navigationService.getNavigation(roleId);
    
  }
}