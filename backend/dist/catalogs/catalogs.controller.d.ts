import { CatalogsService } from './catalogs.service';
import { CreateCatalogDTO } from './dto/create-catalog-dto';
import { GetCatalogsDTO } from './dto/get-catalogs.dto';
export declare class CatalogsController {
    private readonly CatalogsService;
    constructor(CatalogsService: CatalogsService);
    getAll(GetCatalogsDTO: GetCatalogsDTO, id: string): Promise<import("./catalogs.entity").CatalogEntity[]>;
    createCatalog(CreateCatalogDTO: CreateCatalogDTO, id: string): Promise<import("./catalogs.entity").CatalogEntity>;
    updateCatalog(CreateCatalogDTO: CreateCatalogDTO, catalogId: string, id: string): Promise<import("./catalogs.entity").CatalogEntity | null>;
    deleteCatalog(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
}
