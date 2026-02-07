import { Body, NotFoundException, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { Exp } from '../exp.entity';
import { GetExpDetailDTO } from './dto/get-exp-detail.dto';
import { ExpDetail } from './expdetail.entity';
import { CurrentUserID } from 'src/auth/user.docorator';

export class ExpDetailService {
  constructor(
    @InjectRepository(ExpDetail) private expDetailRep: Repository<ExpDetail>,
    @InjectRepository(Exp) private expRep: Repository<Exp>,
  ) {}

  getAll(
    @Query() { expID }: { expID: string },
    @CurrentUserID() userId: string,
  ) {
    return instanceToPlain(
      this.expDetailRep.find({
        where: {
          expId: expID,
          userId,
        },
      }),
    );
  }

  getId(
    @Param('id') id: string,
    @Query() { expID }: { expID: string },
    @CurrentUserID() userId: string,
  ) {
    return instanceToPlain(
      this.expDetailRep.findOne({
        where: {
          id: id,
          expId: expID,
          userId,
        },
      }),
    );
  }

  async createExpDetail(
    expID: string,
    exp: GetExpDetailDTO,
    @CurrentUserID() userId: string,
  ) {
    const oldExp = await this.expRep.findOne({
      where: {
        id: expID,
        userId,
      },
    });
    const newExpDetail = this.expDetailRep.create({ ...exp, userId });
    if (oldExp) {
      // newExpDetail.exp = oldExp;
      newExpDetail.expId = expID;
    }
    return instanceToPlain(this.expDetailRep.save(newExpDetail));
  }

  async updateDetail(
    @Param('id') id: string,
    @Body() { expID, exp }: { expID: string; exp: GetExpDetailDTO },
    @CurrentUserID() userId: string,
  ) {
    const expOldDetail = await this.expDetailRep.findOne({
      where: {
        id,
        expId: expID,
        userId,
      },
    });
    if (!expOldDetail) {
      throw new NotFoundException(`ExpDetail with ID ${id} not found`);
    }

    return instanceToPlain(this.expDetailRep.save({ ...expOldDetail, ...exp }));
  }

  async deleteExpDetail(
    @Param('id') id: string,
    @Body() expID: string,
    @CurrentUserID() userId: string,
  ) {
    const result = await this.expDetailRep
      .createQueryBuilder()
      .delete()
      .from(ExpDetail)
      .where('id = :expDetailID', { expDetailID: id })
      .andWhere('expId = :expID', { expID })
      .andWhere('userId = :userID', { userID: userId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`ExpDetail ${id} not exists`);
    }
  }
}
