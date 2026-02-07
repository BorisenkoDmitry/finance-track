import { Body, NotFoundException, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserID } from 'src/auth/user.docorator';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Between, FindOperator, ILike, Repository } from 'typeorm';
import { GetExpFilterDTO } from './dto/get-exp-filter.dto';
import { GetExpDTO } from './dto/get-exp.dto';
import { Exp } from './exp.entity';
import { GetExpSumDTO } from './expDetail/dto/get-exp-sum.dto';
import { ExpDetail } from './expDetail/expdetail.entity';

interface RawResult {
  total: number;
  day: string;
}

const buildWhereFromParams = (params: GetExpFilterDTO) => {
  const where: {
    price?: string;
    descr?: FindOperator<string>;
  } = {};
  if (params.price !== undefined && params.price !== null) {
    const p = params.price;
    if (!Number.isNaN(p) && Number(params.price) != 0) {
      where.price = p;
    }
  }

  if (params.descr != undefined && params.descr.length > 0) {
    where.descr = ILike(`%${params.descr}%`);
  }

  return where;
};

export class ExpService {
  constructor(
    @InjectRepository(Exp) private expRep: Repository<Exp>,
    @InjectRepository(ExpDetail) private expDetailRep: Repository<ExpDetail>,
    @InjectRepository(CatalogEntity)
    private catalogRep: Repository<CatalogEntity>,
  ) {}

  async getAllExp(
    @Query() GetExpDTO: GetExpFilterDTO,
    @CurrentUserID() userId: string,
  ): Promise<Exp[]> {
    const a = await this.expRep.find({
      where: {
        date: Between(GetExpDTO.dateStart, GetExpDTO.dateEnd),
        userId,
        ...buildWhereFromParams(GetExpDTO),
        catalogItem: {
          id: GetExpDTO.categoryId
            ? GetExpDTO.categoryId?.length > 0
              ? GetExpDTO.categoryId
              : undefined
            : undefined,
        },
      },
      relations: ['products', 'catalogItem'],
      order: {
        date: 'DESC',
      },
    });
    const exps = a.flatMap((x) => {
      const { catalogItem, ...other } = x;
      return { ...other, categoryName: catalogItem?.catalogName };
    });
    return exps;
  }

  getExpId(
    @Param('id') id: string,
    @CurrentUserID() userId: string,
  ): Promise<Exp | null> {
    const exp = this.expRep.findOne({
      where: {
        id: id,
        userId,
      },
      relations: ['products', 'catalogItem'],
    });
    return exp;
  }

  createExp(@Body() exp: GetExpDTO, @CurrentUserID() userId: string) {
    const expNew = this.expRep.create({ ...exp, userId });
    return this.expRep.save(expNew);
  }

  async updateExp(
    @Param('id') id: string,
    @Body() exp: GetExpDTO,
    @CurrentUserID() userId: string,
  ): Promise<void> {
    const oldExp = await this.getExpId(id, userId);
    if (!oldExp) {
      throw new NotFoundException('Exp not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { catalogId, catalogItem, ...other } = oldExp;
    const editedExp = { ...other, ...exp };
    await this.expRep.save(editedExp);
  }

  async deleteExp(@Param('id') id: string, @CurrentUserID() userId: string) {
    const result = await this.expRep.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Exp ${id} not exists`);
    }

    return result;
  }

  async getExpSumUser(@CurrentUserID() userId: string) {
    const l = await this.expRep
      .createQueryBuilder('exp')
      .select('SUM(exp.price)', 'total')
      .where('exp.userId = :userId', { userId })
      .getRawOne<RawResult>();
    return Number(l?.total ?? 0);
  }

  async getExpSumRange(
    @CurrentUserID() userId: string,
    @Query() GetExpSumDto: GetExpSumDTO,
  ) {
    const days: RawResult[] = await this.expRep
      .createQueryBuilder('exp')
      .select('DATE(exp.date)', 'day')
      .addSelect('SUM(exp.price)', 'total')

      .where('exp.userId = :userId', { userId })
      .andWhere('exp.catalogId = :catalogId', {
        catalogId: GetExpSumDto.catalogId,
      })
      .andWhere('exp.date BETWEEN :start AND :end', {
        start: GetExpSumDto.dateStart,
        end: GetExpSumDto.dateEnd,
      })
      .groupBy('DATE(exp.date)')
      .orderBy('DATE(exp.date)', 'ASC')
      .getRawMany();
    const totalAcrossPeriod: { total: string } | undefined = await this.expRep
      .createQueryBuilder('exp')
      .select('SUM(exp.price)', 'total')
      .where('exp.userId = :userId', { userId })
      .andWhere('exp.catalogId = :catalogId', {
        catalogId: GetExpSumDto.catalogId,
      })
      .andWhere('exp.date BETWEEN :start AND :end', {
        start: GetExpSumDto.dateStart,
        end: GetExpSumDto.dateEnd,
      })
      .getRawOne();

    const totalForPeriod = totalAcrossPeriod?.total ?? 0;

    return {
      financeAnalitic: days.map((x) => {
        return { total: x.total, day: x.day };
      }),
      totalPeriodExp: totalForPeriod,
    };
  }
}
