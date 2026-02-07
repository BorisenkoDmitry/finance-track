export declare enum isDeletedEnum {
    no = 0,
    yes = 1,
    all = 2
}
export declare class GetNoteDTO {
    readonly title?: string;
    readonly dateStart: Date;
    readonly dateEnd: Date;
    readonly isDeleted?: isDeletedEnum;
}
