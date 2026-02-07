import { GetIncFilterDTO } from './dto/get-inc-filter';
import { IncEntity } from './inc.entity';
import { IncService } from './inc.service';
import { GetIncDTO } from './dto/get-inc-dto';
export declare class IncController {
    private readonly IncServer;
    constructor(IncServer: IncService);
    getAllInc(GetIncDTO: GetIncFilterDTO, userId: string): Promise<IncEntity[]>;
    getIncId(id: string, userId: string): Promise<IncEntity | null>;
    createInc(inc: GetIncDTO, userId: string): Promise<IncEntity>;
    updateExp(id: string, inc: GetIncDTO, userId: string): Promise<IncEntity>;
    deleteExp(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
}
