import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Repository } from 'typeorm';
import { GetExpFilterDTO } from './dto/get-exp-filter.dto';
import { GetExpDTO } from './dto/get-exp.dto';
import { Exp } from './exp.entity';
import { GetExpSumDTO } from './expDetail/dto/get-exp-sum.dto';
import { ExpDetail } from './expDetail/expdetail.entity';
export declare class ExpService {
    private expRep;
    private expDetailRep;
    private catalogRep;
    constructor(expRep: Repository<Exp>, expDetailRep: Repository<ExpDetail>, catalogRep: Repository<CatalogEntity>);
    getAllExp(GetExpDTO: GetExpFilterDTO, userId: string): Promise<Exp[]>;
    getExpId(id: string, userId: string): Promise<Exp | null>;
    createExp(exp: GetExpDTO, userId: string): Promise<Exp>;
    updateExp(id: string, exp: GetExpDTO, userId: string): Promise<void>;
    deleteExp(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
    getExpSumUser(userId: string): Promise<number>;
    getExpSumRange(userId: string, GetExpSumDto: GetExpSumDTO): Promise<{
        financeAnalitic: {
            total: number;
            day: string;
        }[];
        totalPeriodExp: string | number;
    }>;
}
