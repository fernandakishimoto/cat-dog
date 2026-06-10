import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WS = require('ws') as typeof import('ws');

import type { AppConfigType } from '@/config/configuration';

import type { CreatePetDto } from './dto/create-pet.dto';
import type { ListPetsDto } from './dto/list-pets.dto';

@Injectable()
export class PetsService {

  private readonly logger = new Logger(PetsService.name);

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  private get supabase() {
    return createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.serviceRoleKey', { infer: true }),
      { realtime: { transport: WS as never } },
    );
  }

  async list(dto: ListPetsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('pets')
      .select('*', { count: 'exact' });

    if (dto.search) {
      query = query.or(`name.ilike.%${dto.search}%,city.ilike.%${dto.search}%`);
    }

    if (dto.species) query = query.eq('species', dto.species);
    if (dto.sex) query = query.eq('sex', dto.sex);
    if (dto.size) query = query.eq('size', dto.size);
    if (dto.city) query = query.ilike('city', `%${dto.city}%`);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      this.logger.error('Failed to list pets', error as Error);
      throw new InternalServerErrorException(error.message);
    }

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Pet não encontrado');

    return data;
  }

  async create(dto: CreatePetDto) {
    const { data, error } = await this.supabase
      .from('pets')
      .insert({
        name: dto.name,
        species: dto.species,
        sex: dto.sex,
        size: dto.size,
        age_months: dto.age_months,
        city: dto.city,
        photo_url: dto.photo_url ?? null,
      })
      .select()
      .single();

    if (error) {
      this.logger.error('Failed to create pet', error as Error);
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

}
