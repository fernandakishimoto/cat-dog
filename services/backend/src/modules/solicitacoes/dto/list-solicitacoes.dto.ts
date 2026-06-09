import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListSolicitacoesDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['gato', 'cachorro'])
  species?: 'gato' | 'cachorro';

  @IsOptional()
  @IsIn(['macho', 'femea'])
  sex?: 'macho' | 'femea';

  @IsOptional()
  @IsIn(['pequeno', 'medio', 'grande'])
  size?: 'pequeno' | 'medio' | 'grande';

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

}
