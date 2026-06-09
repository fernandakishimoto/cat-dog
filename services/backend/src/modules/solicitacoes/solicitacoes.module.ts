import { Module } from '@nestjs/common';

import { AdminGuard } from '@/common/guards/admin.guard';

import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';

@Module({
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService, AdminGuard],
})
export class SolicitacoesModule {}
