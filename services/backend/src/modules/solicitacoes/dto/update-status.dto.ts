import { IsIn, IsOptional, IsString } from 'class-validator';

const VALID_STATUSES = [
  'formulario',
  'documentacao',
  'entrevista',
  'visita',
  'aprovacao_final',
  'aprovado',
  'rejeitado',
] as const;

export type AdoptionStatusType = typeof VALID_STATUSES[number];

export class UpdateStatusDto {

  @IsIn(VALID_STATUSES)
  status: AdoptionStatusType;

  @IsOptional()
  @IsString()
  observations?: string;

}
