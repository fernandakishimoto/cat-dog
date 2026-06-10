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
var PetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const WS = require('ws');
let PetsService = PetsService_1 = class PetsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PetsService_1.name);
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
            .from('pets')
            .select('*', { count: 'exact' });
        if (dto.search) {
            query = query.or(`name.ilike.%${dto.search}%,city.ilike.%${dto.search}%`);
        }
        if (dto.species)
            query = query.eq('species', dto.species);
        if (dto.sex)
            query = query.eq('sex', dto.sex);
        if (dto.size)
            query = query.eq('size', dto.size);
        if (dto.city)
            query = query.ilike('city', `%${dto.city}%`);
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) {
            this.logger.error('Failed to list pets', error);
            throw new common_1.InternalServerErrorException(error.message);
        }
        return {
            data: data ?? [],
            total: count ?? 0,
            page,
            limit,
            totalPages: Math.ceil((count ?? 0) / limit),
        };
    }
    async getById(id) {
        const { data, error } = await this.supabase
            .from('pets')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Pet não encontrado');
        return data;
    }
    async create(dto) {
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
            this.logger.error('Failed to create pet', error);
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = PetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PetsService);
//# sourceMappingURL=pets.service.js.map