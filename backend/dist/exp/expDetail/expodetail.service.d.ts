import { Repository } from 'typeorm';
import { Exp } from '../exp.entity';
import { GetExpDetailDTO } from './dto/get-exp-detail.dto';
import { ExpDetail } from './expdetail.entity';
export declare class ExpDetailService {
    private expDetailRep;
    private expRep;
    constructor(expDetailRep: Repository<ExpDetail>, expRep: Repository<Exp>);
    getAll({ expID }: {
        expID: string;
    }, userId: string): Record<string, any>;
    getId(id: string, { expID }: {
        expID: string;
    }, userId: string): Record<string, any>;
    createExpDetail(expID: string, exp: GetExpDetailDTO, userId: string): Promise<Record<string, any>>;
    updateDetail(id: string, { expID, exp }: {
        expID: string;
        exp: GetExpDetailDTO;
    }, userId: string): Promise<Record<string, any>>;
    deleteExpDetail(id: string, expID: string, userId: string): Promise<void>;
}
