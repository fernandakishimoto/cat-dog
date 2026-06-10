import { ListSolicitacoesDto } from './dto/list-solicitacoes.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SolicitacoesService } from './solicitacoes.service';
export declare class SolicitacoesController {
    private readonly service;
    constructor(service: SolicitacoesService);
    list(dto: ListSolicitacoesDto): Promise<{
        data: {
            id: string;
            created_at: string;
            adopter_name: string;
            adopter_email: string;
            status: string;
            pet_id: string;
            pet: {
                name: string;
                species: string;
                sex: string;
                size: string;
                age_months: number;
                city: string;
                photo_url: string | null;
            } | null;
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
        pet: {
            name: string;
            species: string;
            sex: string;
            size: string;
            age_months: number;
            city: string;
            photo_url: string | null;
        } | null;
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
        pet: {
            name: string;
            species: string;
            sex: string;
            size: string;
            age_months: number;
            city: string;
            photo_url: string | null;
        } | null;
    }>;
}
