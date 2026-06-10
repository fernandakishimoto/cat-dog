import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WS = require('ws') as typeof import('ws');

import type { AppConfigType } from '@/config/configuration';

import type { ListSolicitacoesDto } from './dto/list-solicitacoes.dto';
import type { UpdateStatusDto } from './dto/update-status.dto';

type PetRowType = {
  name: string;
  species: string;
  sex: string;
  size: string;
  age_months: number;
  city: string;
  photo_url: string | null;
};

type AdoptionRequestRowType = {
  id: string;
  created_at: string;
  updated_at?: string;
  adopter_name: string;
  adopter_email: string;
  status: string;
  pet_id: string;
  observations?: string | null;
  pets: PetRowType | PetRowType[] | null;
};

const mapPet = (pets: PetRowType | PetRowType[] | null): PetRowType | null => {
  if (!pets) {
    return null;
  }

  if (Array.isArray(pets)) {
    return pets[0] ?? null;
  }

  return pets;
};

const mapAdoptionRequestSummary = (row: AdoptionRequestRowType) => ({
  id: row.id,
  created_at: row.created_at,
  adopter_name: row.adopter_name,
  adopter_email: row.adopter_email,
  status: row.status,
  pet_id: row.pet_id,
  pet: mapPet(row.pets),
});

const mapAdoptionRequestDetail = (row: AdoptionRequestRowType) => ({
  ...mapAdoptionRequestSummary(row),
  updated_at: row.updated_at ?? row.created_at,
  observations: row.observations ?? null,
});

@Injectable()
export class SolicitacoesService {

  private readonly logger = new Logger(SolicitacoesService.name);

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
      .select(
        'id, created_at, adopter_name, adopter_email, status, pet_id, pets(name, species, sex, size, age_months, city, photo_url)',
        { count: 'exact' },
      );

    if (dto.search) {
      query = query.or(
        `adopter_name.ilike.%${dto.search}%,adopter_email.ilike.%${dto.search}%,pets.name.ilike.%${dto.search}%,pets.city.ilike.%${dto.search}%`,
      );
    }

    if (dto.species) query = query.eq('pets.species', dto.species);
    if (dto.sex) query = query.eq('pets.sex', dto.sex);
    if (dto.size) query = query.eq('pets.size', dto.size);
    if (dto.city) query = query.ilike('pets.city', `%${dto.city}%`);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      this.logger.error('Failed to list adoption requests', error as Error);
      throw new InternalServerErrorException(error.message);
    }

    const rows = (data ?? []) as AdoptionRequestRowType[];

    return {
      data: rows.map(mapAdoptionRequestSummary),
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('adoption_requests')
      .select('*, pets(name, species, sex, size, age_months, city, photo_url)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Solicitação não encontrada');

    return mapAdoptionRequestDetail(data as AdoptionRequestRowType);
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
      .select('*, pets(name, species, sex, size, age_months, city, photo_url)')
      .single();

    if (error) {
      this.logger.error('Failed to update adoption request status', error as Error);
      throw new InternalServerErrorException(error.message);
    }

    return mapAdoptionRequestDetail(data as AdoptionRequestRowType);
  }

}
