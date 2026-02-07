import { Role } from 'src/roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Token } from './token/token.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';
import { Budgets } from 'src/budgets/budgets.entity';
import { IncEntity } from 'src/inc/inc.entity';
import { Exp } from 'src/exp/exp.entity';
import { ExpDetail } from 'src/exp/expDetail/expdetail.entity';
import { NoteEntity } from 'src/Notes/notes.entity';
import { PlanEntity } from 'src/plans/plan.entity';

@Entity({ name: 'users' })
@Unique(['phone'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  avatarPath: string | null;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles', // связывающая таблица
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => CatalogEntity, (t) => t.user)
  catalogs: CatalogEntity[];

  @OneToMany(() => Budgets, (t) => t.user)
  budgets: Budgets[];

  @OneToMany(() => IncEntity, (t) => t.user)
  incs: IncEntity[];

  @OneToMany(() => Exp, (t) => t.user)
  exps: Exp[];

  @OneToMany(() => ExpDetail, (t) => t.user)
  expDetails: ExpDetail[];

  @OneToMany(() => NoteEntity, (t) => t.user)
  notes: NoteEntity[];

  @OneToMany(() => PlanEntity, (t) => t.user)
  plans: PlanEntity[];
}
