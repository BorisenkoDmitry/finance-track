import { User } from 'src/auth/auth.entity';
import { PlanDetailEntity } from './planDetail/planDetail.entity';
export declare class PlanEntity {
    id: string;
    createdAt: Date;
    updateAt: Date;
    planDate: Date;
    planName: string;
    planPrice: string;
    planColor: string;
    user: User;
    userId: string;
    detailPlans: PlanDetailEntity[];
}
