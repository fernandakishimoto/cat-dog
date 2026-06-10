import { Module } from '@nestjs/common';

import { AdminGuard } from '@/common/guards/admin.guard';

import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  controllers: [PetsController],
  providers: [PetsService, AdminGuard],
})
export class PetsModule {}
