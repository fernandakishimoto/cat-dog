declare const VALID_STATUSES: readonly ["formulario", "documentacao", "entrevista", "visita", "aprovacao_final", "aprovado", "rejeitado"];
export type AdoptionStatusType = typeof VALID_STATUSES[number];
export declare class UpdateStatusDto {
    status: AdoptionStatusType;
    observations?: string;
}
export {};
