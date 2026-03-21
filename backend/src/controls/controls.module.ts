import { Module } from '@nestjs/common';
import { ControlsController } from './controls.controller';
import { ControlsService } from './controls.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ControlsController],
  providers: [ControlsService],
})
export class ControlsModule {}