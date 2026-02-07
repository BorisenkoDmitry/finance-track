import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exp } from '../exp.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/auth/auth.entity';

@Entity()
export class ExpDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  price: string;

  @Column()
  count: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @Column({ name: 'exp_id' })
  expId: string;

  @ManyToOne(() => Exp, (exp) => exp.products, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exp_id' })
  exp: Exp;

  @ManyToOne(() => User, (u) => u.expDetails, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
}
