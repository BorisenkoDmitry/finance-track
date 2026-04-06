import { Module } from '@nestjs/common';
import { ExpController } from './exp.controller';
import { ExpService } from './exp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exp } from './exp.entity';
import { ExpDetailModule } from './expDetail/expdetail.module';
import { ExpDetail } from './expDetail/expdetail.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { CatalogsService } from 'src/catalogs/catalogs.service';
import { ReceiptScanService } from './receipt-scan.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exp, ExpDetail, CatalogEntity]),
    ExpDetailModule,
  ],
  controllers: [ExpController],
  providers: [ExpService, CatalogsService, ReceiptScanService],
})
export class ExpModule {}
