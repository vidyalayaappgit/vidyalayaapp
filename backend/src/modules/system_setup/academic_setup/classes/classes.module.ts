// D:\schoolapp\backend\src\modules\system_setup\academic_setup\classes\classes.module.ts

import { Module } from '@nestjs/common';
import { ClassController } from './classes.controller';
import { ClassService } from './classes.service';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassesModule {}