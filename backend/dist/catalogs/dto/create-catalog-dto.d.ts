import { TypeCatalog } from '../catalogs.entity';
export declare class CreateCatalogDTO {
    catalogName: string;
    catalogType: TypeCatalog;
    readonly catalogColor?: string;
}
