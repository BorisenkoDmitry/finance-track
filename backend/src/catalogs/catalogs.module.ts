import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogEntity } from './catalogs.entity';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';

@Module({
  controllers: [CatalogsController],
  providers: [CatalogsService],
  imports: [TypeOrmModule.forFeature([CatalogEntity])],
})
export class CatalogModule {}
