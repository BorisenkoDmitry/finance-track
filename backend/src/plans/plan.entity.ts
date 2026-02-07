import { Exclude, Transform } from 'class-transformer';
import { User } from 'src/auth/auth.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanDetailEntity } from './planDetail/planDetail.entity';

@Entity()
export class PlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updateAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  planDate: Date;

  @Column({ type: 'varchar' })
  planName: string;

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  @Transform(({ value }) => Number(value))
  planPrice: string;

  @Column({ type: 'varchar', default: null })
  planColor: string;

  @ManyToOne(() => User, (u) => u.plans, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user: User;

  @Column()
  @Exclude()
  userId: string;

  @OneToMany(() => PlanDetailEntity, (t) => t.plan)
  detailPlans: PlanDetailEntity[];
}
