import { Exp } from './exp.entity';
import { ExpService } from './exp.service';
import { GetExpDTO } from './dto/get-exp.dto';
import { GetExpFilterDTO } from './dto/get-exp-filter.dto';
export declare class ExpController {
    private readonly ExpService;
    constructor(ExpService: ExpService);
    getAllExp(GetExpDTO: GetExpFilterDTO, userId: string): Promise<Exp[]>;
    getExpId(id: string, userId: string): Promise<Exp | null>;
    createExp(exp: GetExpDTO, userId: string): Promise<Exp>;
    updateExp(id: string, exp: GetExpDTO, userId: string): Promise<void>;
    deleteExp(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
}
