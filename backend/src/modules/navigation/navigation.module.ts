import { Module } from '@nestjs/common';

import { NavigationController } from '@modules/navigation/navigation.controller';
import { NavigationService } from '@modules/navigation/navigation.service';

import { DatabaseModule } from '@core/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NavigationController],
  providers: [NavigationService],
})
export class NavigationModule {}