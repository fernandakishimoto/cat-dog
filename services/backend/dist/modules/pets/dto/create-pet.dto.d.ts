export declare class CreatePetDto {
    name: string;
    species: 'gato' | 'cachorro';
    sex: 'macho' | 'femea';
    size: 'pequeno' | 'medio' | 'grande';
    age_months: number;
    city: string;
    photo_url?: string;
}
