import { Exclude } from 'class-transformer';
import { User } from 'src/auth/auth.entity';
import { Budgets } from 'src/budgets/budgets.entity';
import { Exp } from 'src/exp/exp.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TypeCatalog {
  inc = 1,
  exp,
  source,
  pay,
}

@Entity()
export class CatalogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  catalogName: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  catalogColor: string;

  @Column({
    type: 'enum',
    enum: TypeCatalog,
  })
  catalogType: TypeCatalog;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.catalogs, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Exp, (t) => t.catalogItem)
  exps: Exp[];

  @OneToMany(() => Budgets, (t) => t.catalogItem)
  budgets: Budgets[];
}
