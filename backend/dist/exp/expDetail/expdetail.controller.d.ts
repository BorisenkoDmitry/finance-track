import { GetExpDetailDTO } from './dto/get-exp-detail.dto';
import { ExpDetailService } from './expodetail.service';
export declare class ExpDetailController {
    private readonly ExpDetailService;
    constructor(ExpDetailService: ExpDetailService);
    getAll({ expID }: {
        expID: string;
    }, userId: string): Record<string, any>;
    getId(id: string, { expID }: {
        expID: string;
    }, userId: string): Record<string, any>;
    createExpDetail({ expID, expDetail }: {
        expID: string;
        expDetail: GetExpDetailDTO;
    }, userId: string): Promise<Record<string, any>>;
    updateDetail(id: string, { expID, exp }: {
        expID: string;
        exp: GetExpDetailDTO;
    }, userId: string): Promise<Record<string, any>>;
    deleteExpDetail(id: string, { expID }: {
        expID: string;
    }, userId: string): Promise<void>;
}
