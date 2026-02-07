import { CategoryType } from './get-budgets.dto';
export declare class CreatedBudgetsDTO {
    readonly categoryName?: string;
    readonly color?: string;
    readonly comment?: string;
    readonly period?: 'month';
    readonly planned_amount?: string;
    readonly dateCreated?: string;
    readonly catalogId?: string;
    readonly type?: CategoryType;
}
