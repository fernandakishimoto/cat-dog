import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminGuard } from '@/common/guards/admin.guard';

import { CreatePetDto } from './dto/create-pet.dto';
import { ListPetsDto } from './dto/list-pets.dto';
import { PetsService } from './pets.service';

@Controller('pets')
@UseGuards(AdminGuard)
export class PetsController {

  constructor(private readonly service: PetsService) {}

  @Get()
  list(@Query() dto: ListPetsDto) {
    return this.service.list(dto);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePetDto) {
    return this.service.create(dto);
  }

}
