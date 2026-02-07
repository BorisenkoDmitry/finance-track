import { Repository } from 'typeorm';
import { GetIncDTO } from './dto/get-inc-dto';
import { GetIncFilterDTO } from './dto/get-inc-filter';
import { IncEntity } from './inc.entity';
import { GetIncSumDTO } from './dto/get-inc-sum.dto';
export declare class IncService {
    private incRep;
    constructor(incRep: Repository<IncEntity>);
    getAllInc(GetIncDTO: GetIncFilterDTO, userId: string): Promise<IncEntity[]>;
    getIncId(id: string, userId: string): Promise<IncEntity | null>;
    createInc(inc: GetIncDTO, userId: string): Promise<IncEntity>;
    updateExp(id: string, inc: GetIncDTO, userId: string): Promise<IncEntity>;
    deleteInc(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
    getIncSumUser(userId: string): Promise<number>;
    getIncSumRange(userId: string, GetIncSumDto: GetIncSumDTO): Promise<IncEntity[]>;
}
