import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanCheckedDto } from './dto/update-plan-checked.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanEntity } from './plan.entity';
import { PlanDetailEntity } from './planDetail/planDetail.entity';
import { DetailPlansService } from './planDetail/planDetail.service';
export declare class PlansService {
    private planRep;
    private planDetailRep;
    private readonly planDetailService;
    constructor(planRep: Repository<PlanEntity>, planDetailRep: Repository<PlanDetailEntity>, planDetailService: DetailPlansService);
    getAllPlans(userId: string): Promise<{
        detailPlans: {
            planDetailPrice: number;
            id: string;
            createdAt: Date;
            updateAt: Date;
            planDetailDatePay: Date;
            planDetailDate: Date;
            isComplete: boolean;
            plan: PlanEntity;
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
    createPlan(params: CreatePlanDto, userId: string): Promise<PlanEntity | null>;
    updatePlant(params: UpdatePlanDto, userId: string): Promise<PlanEntity>;
    updatePlanChecked(id: string, planCheckedDTO: UpdatePlanCheckedDto): Promise<PlanEntity>;
    deletePlan(id: string, userId: string): Promise<{
        isDeleted: boolean;
    }>;
}
