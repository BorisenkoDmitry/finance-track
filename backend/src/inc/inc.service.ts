import { Body, NotFoundException, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOperator, Repository } from 'typeorm';
import { GetIncDTO } from './dto/get-inc-dto';
import { GetIncFilterDTO } from './dto/get-inc-filter';
import { IncEntity } from './inc.entity';
import { CurrentUserID } from 'src/auth/user.docorator';
import { GetIncSumDTO } from './dto/get-inc-sum.dto';

type RawResult = { total: string | null };

const buildWhereFromParams = (params: GetIncFilterDTO) => {
  const where: {
    source?: FindOperator<string>;
    description?: FindOperator<string>;
    sum?: string;
  } = {};
  if (params.sum !== undefined && params.sum !== null) {
    const p = params.sum;
    if (!Number.isNaN(p) && Number(params.sum) != 0) {
      where.sum = p;
    }
  }

  // if (params.source != undefined && params.source.length > 0) {
  //   where.source = ILike(`%${params.source}%`);
  // }

  // if (params.description != undefined && params.description.length > 0) {
  //   where.description = ILike(`%${params.description}%`);
  // }

  return where;
};

export class IncService {
  constructor(
    @InjectRepository(IncEntity) private incRep: Repository<IncEntity>,
  ) {}

  getAllInc(
    @Query() GetIncDTO: GetIncFilterDTO,
    @CurrentUserID() userId: string,
  ): Promise<IncEntity[]> {
    console.log(GetIncDTO);
    return this.incRep.find({
      where: {
        date: Between(GetIncDTO.dateStart, GetIncDTO.dateEnd),
        userId: userId,
        ...buildWhereFromParams(GetIncDTO),
      },
      order: {
        date: 'DESC',
      },
    });
  }

  getIncId(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ): Promise<IncEntity | null> {
    const inc = this.incRep.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });
    return inc;
  }

  createInc(@Body() inc: GetIncDTO, @CurrentUserID() userId: string) {
    const incNew = this.incRep.create({ ...inc, userId });
    return this.incRep.save(incNew);
  }

  async updateExp(
    @Param('id') id: string,
    @Body() inc: GetIncDTO,
    @CurrentUserID() userId: string,
  ): Promise<IncEntity> {
    const oldInc = await this.getIncId(id, userId);
    if (!oldInc) {
      throw new NotFoundException('Inc not found');
    }

    const editedInc = { ...oldInc, ...inc };
    const res = await this.incRep.save(editedInc);
    return res;
  }

  async deleteInc(@Param('id') id: string, @CurrentUserID() userId: string) {
    const result = await this.incRep.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Exp ${id} not exists`);
    }

    return result;
  }

  async getIncSumUser(@CurrentUserID() userId: string) {
    const l = await this.incRep
      .createQueryBuilder('inc')
      .select('SUM(inc.sum)', 'total')
      .where('inc.userId = :userId', { userId })
      .getRawOne<RawResult>();
    return Number(l?.total ?? 0);
  }

  async getIncSumRange(
    @CurrentUserID() userId: string,
    @Query() GetIncSumDto: GetIncSumDTO,
  ) {
    let incs: IncEntity[] = [];

    incs = await this.incRep.find({
      where: {
        userId,
        date: Between(GetIncSumDto.dateStart, GetIncSumDto.dateEnd),
      },
    });

    return incs;
  }
}
