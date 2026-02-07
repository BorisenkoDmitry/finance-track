import { IsEnum } from 'class-validator';
import { TypeCatalog } from '../catalogs.entity';

export class GetCatalogsDTO {
  @IsEnum(TypeCatalog)
  readonly type: TypeCatalog;
}
