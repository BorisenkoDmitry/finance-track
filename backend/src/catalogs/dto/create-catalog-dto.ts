import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TypeCatalog } from '../catalogs.entity';

export class CreateCatalogDTO {
  @IsString()
  @IsOptional()
  catalogName: string;

  @IsEnum(TypeCatalog)
  @IsOptional()
  catalogType: TypeCatalog;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly catalogColor?: string;
}
