import { User } from 'src/auth/auth.entity';
export declare class NoteEntity {
    id: string;
    createdAt: Date;
    updateAt: Date;
    completed: boolean;
    isDeleted: boolean;
    title: string;
    content: string;
    user: User;
    userId: string;
}
