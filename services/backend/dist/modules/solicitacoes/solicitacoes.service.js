"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SolicitacoesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitacoesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const WS = require('ws');
const mapPet = (pets) => {
    if (!pets) {
        return null;
    }
    if (Array.isArray(pets)) {
        return pets[0] ?? null;
    }
    return pets;
};
const mapAdoptionRequestSummary = (row) => ({
    id: row.id,
    created_at: row.created_at,
    adopter_name: row.adopter_name,
    adopter_email: row.adopter_email,
    status: row.status,
    pet_id: row.pet_id,
    pet: mapPet(row.pets),
});
const mapAdoptionRequestDetail = (row) => ({
    ...mapAdoptionRequestSummary(row),
    updated_at: row.updated_at ?? row.created_at,
    observations: row.observations ?? null,
});
let SolicitacoesService = SolicitacoesService_1 = class SolicitacoesService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SolicitacoesService_1.name);
    }
    get supabase() {
        return (0, supabase_js_1.createClient)(this.configService.get('supabase.url', { infer: true }), this.configService.get('supabase.serviceRoleKey', { infer: true }), { realtime: { transport: WS } });
    }
    async list(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        let query = this.supabase
            .from('adoption_requests')
            .select('id, created_at, adopter_name, adopter_email, status, pet_id, pets(name, species, sex, size, age_months, city, photo_url)', { count: 'exact' });
        if (dto.search) {
            query = query.or(`adopter_name.ilike.%${dto.search}%,adopter_email.ilike.%${dto.search}%,pets.name.ilike.%${dto.search}%,pets.city.ilike.%${dto.search}%`);
        }
        if (dto.species)
            query = query.eq('pets.species', dto.species);
        if (dto.sex)
            query = query.eq('pets.sex', dto.sex);
        if (dto.size)
            query = query.eq('pets.size', dto.size);
        if (dto.city)
            query = query.ilike('pets.city', `%${dto.city}%`);
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) {
            this.logger.error('Failed to list adoption requests', error);
            throw new common_1.InternalServerErrorException(error.message);
        }
        const rows = (data ?? []);
        return {
            data: rows.map(mapAdoptionRequestSummary),
            total: count ?? 0,
            page,
            limit,
            totalPages: Math.ceil((count ?? 0) / limit),
        };
    }
    async getById(id) {
        const { data, error } = await this.supabase
            .from('adoption_requests')
            .select('*, pets(name, species, sex, size, age_months, city, photo_url)')
            .eq('id', id)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Solicitação não encontrada');
        return mapAdoptionRequestDetail(data);
    }
    async updateStatus(id, dto) {
        const { data: existing } = await this.supabase
            .from('adoption_requests')
            .select('id')
            .eq('id', id)
            .single();
        if (!existing)
            throw new common_1.NotFoundException('Solicitação não encontrada');
        const updatePayload = {
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
            this.logger.error('Failed to update adoption request status', error);
            throw new common_1.InternalServerErrorException(error.message);
        }
        return mapAdoptionRequestDetail(data);
    }
};
exports.SolicitacoesService = SolicitacoesService;
exports.SolicitacoesService = SolicitacoesService = SolicitacoesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SolicitacoesService);
//# sourceMappingURL=solicitacoes.service.js.map