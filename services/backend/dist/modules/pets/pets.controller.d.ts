import { CreatePetDto } from './dto/create-pet.dto';
import { ListPetsDto } from './dto/list-pets.dto';
import { PetsService } from './pets.service';
export declare class PetsController {
    private readonly service;
    constructor(service: PetsService);
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
