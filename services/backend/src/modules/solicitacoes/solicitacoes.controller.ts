import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminGuard } from '@/common/guards/admin.guard';

import { ListSolicitacoesDto } from './dto/list-solicitacoes.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SolicitacoesService } from './solicitacoes.service';

@Controller('adoption-requests')
@UseGuards(AdminGuard)
export class SolicitacoesController {

  constructor(private readonly service: SolicitacoesService) {}

  @Get()
  list(@Query() dto: ListSolicitacoesDto) {
    return this.service.list(dto);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }

}
