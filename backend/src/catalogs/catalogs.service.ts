import { InjectRepository } from '@nestjs/typeorm';
import { CatalogEntity, TypeCatalog } from './catalogs.entity';
import { Repository } from 'typeorm';
import { Body, NotFoundException, Param, Query } from '@nestjs/common';
import { GetCatalogsDTO } from './dto/get-catalogs.dto';
import { CreateCatalogDTO } from './dto/create-catalog-dto';
import { CurrentUserID } from 'src/auth/user.docorator';

export class CatalogsService {
  constructor(
    @InjectRepository(CatalogEntity)
    private catalogRep: Repository<CatalogEntity>,
  ) {}
  getAll(@Query() GetCatalogsDTO: GetCatalogsDTO, @CurrentUserID() id: string) {
    return this.catalogRep.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        catalogType: GetCatalogsDTO.type,
        userId: id,
      },
    });
  }

  async getCatalogExps(
    @CurrentUserID() id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const qb = this.catalogRep
      .createQueryBuilder('catalog')
      .leftJoinAndSelect('catalog.exps', 'exp')
      .where('catalog.catalogType = :type', { type: TypeCatalog.exp })
      .andWhere('catalog.userId = :id', { id });

    if (startDate && endDate) {
      qb.andWhere('exp.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      qb.andWhere('exp.date >= :startDate', { startDate });
    } else if (endDate) {
      qb.andWhere('exp.date <= :endDate', { endDate });
    }

    const catalogs = await qb.getMany();
    const allExps = catalogs.flatMap((c) => c.exps ?? []);
    return allExps;
  }

  createCatalog(
    @Body() CreateCatalogDTO: CreateCatalogDTO,
    @CurrentUserID() id: string,
  ) {
    const catalogNew = this.catalogRep.create({
      ...CreateCatalogDTO,
      userId: id,
    });
    return this.catalogRep.save(catalogNew);
  }

  async updateCatalog(
    @Body() CreateCatalogDTO: CreateCatalogDTO,
    @Param('id') catalogId: string,
    @CurrentUserID() id: string,
  ) {
    console.log(catalogId);
    const oldExp = await this.catalogRep.update(
      {
        id: catalogId,
        userId: id,
      },
      CreateCatalogDTO,
    );

    if (!oldExp) {
      throw new NotFoundException(`Catalog with ID ${catalogId} not found`);
    }

    return this.catalogRep.findOne({ where: { id: catalogId, userId: id } });
  }

  async deleteCatalog(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ) {
    const result = await this.catalogRep.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Catalog ${id} not exists`);
    }

    return result;
  }
}
