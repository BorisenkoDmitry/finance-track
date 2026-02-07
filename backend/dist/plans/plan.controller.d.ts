import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plan.service';
import { UpdatePlanCheckedDto } from './dto/update-plan-checked.dto';
export declare class PlansController {
    private readonly PlanService;
    constructor(PlanService: PlansService);
    getAllPlanes(userId: string): Promise<{
        detailPlans: {
            planDetailPrice: number;
            id: string;
            createdAt: Date;
            updateAt: Date;
            planDetailDatePay: Date;
            planDetailDate: Date;
            isComplete: boolean;
            plan: import("./plan.entity").PlanEntity;
            planId: string;
        }[];
        planPrice: number;
        id: string;
        createdAt: Date;
        updateAt: Date;
        planDate: Date;
        planName: string;
        planColor: string;
        user: import("../auth/auth.entity").User;
        userId: string;
    }[]>;
    createNewPlan(params: CreatePlanDto, userId: string): Promise<import("./plan.entity").PlanEntity | null>;
    updatePlanChecked(id: string, planCheckedDTO: UpdatePlanCheckedDto): Promise<import("./plan.entity").PlanEntity>;
    updatePlan(params: UpdatePlanDto, userId: string): Promise<import("./plan.entity").PlanEntity>;
    deletePlan(id: string, userId: string): Promise<{
        isDeleted: boolean;
    }>;
}
