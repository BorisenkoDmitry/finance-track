import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanEntity } from '../plan.entity';

@Entity()
export class PlanDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updateAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: null })
  planDetailDatePay: Date;

  @CreateDateColumn({ type: 'timestamp' })
  planDetailDate: Date;

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  @Transform(({ value }) => Number(value))
  planDetailPrice: string;

  @Column({ type: 'boolean', default: false })
  isComplete: boolean;

  @ManyToOne(() => PlanEntity, (u) => u.detailPlans, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  @Exclude()
  plan: PlanEntity;

  @Column()
  @Exclude()
  planId: string;
}
