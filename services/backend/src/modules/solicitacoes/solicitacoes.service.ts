import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WS = require('ws') as typeof import('ws');

import type { AppConfigType } from '@/config/configuration';

import type { ListSolicitacoesDto } from './dto/list-solicitacoes.dto';
import type { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class SolicitacoesService {

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  private get supabase() {
    return createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.serviceRoleKey', { infer: true }),
      { realtime: { transport: WS as never } },
    );
  }

  async list(dto: ListSolicitacoesDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('adoption_requests')
      .select('id, created_at, adopter_name, pet_name, pet_species, pet_sex, pet_size, pet_age_months, pet_city, status', { count: 'exact' });

    if (dto.search) {
      query = query.or(`pet_name.ilike.%${dto.search}%,pet_city.ilike.%${dto.search}%,adopter_name.ilike.%${dto.search}%`);
    }

    if (dto.species) query = query.eq('pet_species', dto.species);
    if (dto.sex) query = query.eq('pet_sex', dto.sex);
    if (dto.size) query = query.eq('pet_size', dto.size);
    if (dto.city) query = query.ilike('pet_city', `%${dto.city}%`);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

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
      .from('adoption_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Solicitação não encontrada');

    return data;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const { data: existing } = await this.supabase
      .from('adoption_requests')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundException('Solicitação não encontrada');

    const updatePayload: Record<string, unknown> = {
      status: dto.status,
      updated_at: new Date().toISOString(),
    };

    if (dto.observations !== undefined) {
      updatePayload['observations'] = dto.observations;
    }

    const { data, error } = await this.supabase
      .from('adoption_requests')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

}
