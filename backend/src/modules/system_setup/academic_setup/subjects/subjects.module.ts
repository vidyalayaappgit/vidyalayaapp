import { Module } from '@nestjs/common';
import { SubjectController } from './subjects.controller';
import { SubjectService } from './subjects.service';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectsModule {}
