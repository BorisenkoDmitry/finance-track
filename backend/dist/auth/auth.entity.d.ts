import { Role } from 'src/roles/roles.entity';
import { Token } from './token/token.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Budgets } from 'src/budgets/budgets.entity';
import { IncEntity } from 'src/inc/inc.entity';
import { Exp } from 'src/exp/exp.entity';
import { ExpDetail } from 'src/exp/expDetail/expdetail.entity';
import { NoteEntity } from 'src/Notes/notes.entity';
import { PlanEntity } from 'src/plans/plan.entity';
export declare class User {
    id: string;
    email: string;
    phone: string;
    name: string;
    surname: string;
    password: string;
    avatarPath: string | null;
    roles: Role[];
    tokens: Token[];
    catalogs: CatalogEntity[];
    budgets: Budgets[];
    incs: IncEntity[];
    exps: Exp[];
    expDetails: ExpDetail[];
    notes: NoteEntity[];
    plans: PlanEntity[];
}
