import { PlanEntity } from '../plan.entity';
export declare class PlanDetailEntity {
    id: string;
    createdAt: Date;
    updateAt: Date;
    planDetailDatePay: Date;
    planDetailDate: Date;
    planDetailPrice: string;
    isComplete: boolean;
    plan: PlanEntity;
    planId: string;
}
