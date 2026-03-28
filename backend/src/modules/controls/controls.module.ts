import { Module } from '@nestjs/common';

import { ControlsController } from '@modules/controls/controls.controller';
import { ControlsService } from '@modules/controls/controls.service';

import { DatabaseModule } from '@core/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ControlsController],
  providers: [ControlsService],
})
export class ControlsModule {}