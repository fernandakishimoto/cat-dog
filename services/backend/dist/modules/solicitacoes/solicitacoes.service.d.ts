import { ConfigService } from '@nestjs/config';
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
export declare class SolicitacoesService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService<AppConfigType, true>);
    private get supabase();
    list(dto: ListSolicitacoesDto): Promise<{
        data: {
            id: string;
            created_at: string;
            adopter_name: string;
            adopter_email: string;
            status: string;
            pet_id: string;
            pet: PetRowType | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<{
        updated_at: string;
        observations: string | null;
        id: string;
        created_at: string;
        adopter_name: string;
        adopter_email: string;
        status: string;
        pet_id: string;
        pet: PetRowType | null;
    }>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<{
        updated_at: string;
        observations: string | null;
        id: string;
        created_at: string;
        adopter_name: string;
        adopter_email: string;
        status: string;
        pet_id: string;
        pet: PetRowType | null;
    }>;
}
export {};
