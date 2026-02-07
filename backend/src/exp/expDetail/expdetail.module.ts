import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpDetailController } from './expdetail.controller';
import { ExpDetail } from './expdetail.entity';
import { ExpDetailService } from './expodetail.service';
import { Exp } from '../exp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpDetail, Exp])],
  controllers: [ExpDetailController],
  providers: [ExpDetailService],
})
export class ExpDetailModule {}
