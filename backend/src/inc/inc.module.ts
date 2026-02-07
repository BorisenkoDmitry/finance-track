import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncEntity } from './inc.entity';
import { IncController } from './inc.controller';
import { IncService } from './inc.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncEntity])],
  controllers: [IncController],
  providers: [IncService],
})
export class IncModule {}
