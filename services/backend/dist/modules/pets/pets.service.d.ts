import { ConfigService } from '@nestjs/config';
import type { AppConfigType } from '@/config/configuration';
import type { CreatePetDto } from './dto/create-pet.dto';
import type { ListPetsDto } from './dto/list-pets.dto';
export declare class PetsService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService<AppConfigType, true>);
    private get supabase();
    list(dto: ListPetsDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    create(dto: CreatePetDto): Promise<any>;
}
