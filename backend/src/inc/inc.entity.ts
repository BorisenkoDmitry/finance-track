import { User } from 'src/auth/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class IncEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  source: string;

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  sum: string;

  @Column()
  description: string;

  @Column()
  typeInc: string;

  @Column()
  method: string;

  @ManyToOne(() => User, (u) => u.incs, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
}
