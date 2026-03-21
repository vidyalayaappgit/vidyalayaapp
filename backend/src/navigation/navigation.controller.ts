import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {

  constructor(private navigationService: NavigationService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getNavigation(@Req() req: any) {

    console.log("USER:", req.user); // 🔥 DEBUG

    const roleId = req.user.role_id; // ✅ CORRECT

    return this.navigationService.getNavigation(roleId);
  }
}