import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetDto {

  @IsString()
  name!: string;

  @IsIn(['gato', 'cachorro'])
  species!: 'gato' | 'cachorro';

  @IsIn(['macho', 'femea'])
  sex!: 'macho' | 'femea';

  @IsIn(['pequeno', 'medio', 'grande'])
  size!: 'pequeno' | 'medio' | 'grande';

  @Type(() => Number)
  @IsInt()
  @Min(0)
  age_months!: number;

  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  photo_url?: string;

}
