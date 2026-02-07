import { CatalogEntity } from './catalogs.entity';
import { Repository } from 'typeorm';
import { GetCatalogsDTO } from './dto/get-catalogs.dto';
import { CreateCatalogDTO } from './dto/create-catalog-dto';
export declare class CatalogsService {
    private catalogRep;
    constructor(catalogRep: Repository<CatalogEntity>);
    getAll(GetCatalogsDTO: GetCatalogsDTO, id: string): Promise<CatalogEntity[]>;
    getCatalogExps(id: string, startDate?: string, endDate?: string): Promise<import("../exp/exp.entity").Exp[]>;
    createCatalog(CreateCatalogDTO: CreateCatalogDTO, id: string): Promise<CatalogEntity>;
    updateCatalog(CreateCatalogDTO: CreateCatalogDTO, catalogId: string, id: string): Promise<CatalogEntity | null>;
    deleteCatalog(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
}
