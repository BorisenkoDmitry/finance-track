import { PlanDetailEntity } from './planDetail.entity';
import { Repository } from 'typeorm';
import { CreatePlanDetailDto } from './dto/create-detail-plan.dto';
export declare class DetailPlansService {
    private planDetailRep;
    constructor(planDetailRep: Repository<PlanDetailEntity>);
    getAllPlansDetail(planId: string): Promise<PlanDetailEntity[]>;
    createPlanDetail(params: CreatePlanDetailDto): Promise<PlanDetailEntity>;
    updatePlanDetail(id: string, params: CreatePlanDetailDto): Promise<PlanDetailEntity>;
    deletePlanDetail(id: string): Promise<import("typeorm").DeleteResult>;
}
