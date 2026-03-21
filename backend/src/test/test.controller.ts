import { Controller, Get, Post } from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('test')
export class TestController {

  // ✅ Only JWT required
  @Get('profile')
  getProfile() {
    return { message: 'JWT working ✅' };
  }

  // ❌ Permission required
  @Permissions({
    pageId: 1,
    formId: 1,
    controlCode: 'view'
  })
  @Get('view')
  viewTest() {
    return { message: 'VIEW allowed ✅' };
  }

  @Permissions({
    pageId: 1,
    formId: 1,
    controlCode: 'save'
  })
  @Post('save')
  saveTest() {
    return { message: 'SAVE allowed ✅' };
  }
}