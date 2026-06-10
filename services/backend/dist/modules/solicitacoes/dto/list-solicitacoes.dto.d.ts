export declare class ListSolicitacoesDto {
    search?: string;
    species?: 'gato' | 'cachorro';
    sex?: 'macho' | 'femea';
    size?: 'pequeno' | 'medio' | 'grande';
    city?: string;
    page?: number;
    limit?: number;
}
