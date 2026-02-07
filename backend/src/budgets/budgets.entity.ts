import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryType } from './dto/get-budgets.dto';
import { User } from 'src/auth/auth.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';

@Entity()
export class Budgets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryName: string;

  @Column()
  color: string;

  @Column()
  comment: string;

  @Column({ type: 'date', nullable: true })
  dateCreated: string;

  @Column()
  period: 'month';

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  planned_amount: string;

  @Column()
  type: CategoryType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.budgets, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => CatalogEntity, (u) => u.budgets, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'catalogId' })
  catalogItem?: CatalogEntity;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  catalogId: string;
}
