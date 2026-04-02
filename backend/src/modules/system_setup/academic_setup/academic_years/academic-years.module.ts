// academic-years.module.ts

import { Module } from '@nestjs/common';
import { AcademicYearsController } from './academic-years.controller';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearsService } from './academic-years.service';

@Module({
  controllers: [AcademicYearsController],
  providers: [AcademicYearService, AcademicYearsService],
  exports: [AcademicYearsService],
})
export class AcademicYearsModule {}