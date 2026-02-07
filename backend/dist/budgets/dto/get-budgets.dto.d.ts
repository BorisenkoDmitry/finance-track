export declare enum CategoryType {
    inc = 1,
    exp = 2,
    source = 3,
    pay = 4,
    all = 5
}
export declare class GetBudgetsDTO {
    readonly dateStart: string;
    readonly dateEnd: string;
    readonly type?: CategoryType;
}
