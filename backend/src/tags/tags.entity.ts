import { User } from 'src/auth/auth.entity';
import { Exp } from 'src/exp/exp.entity';
import { IncEntity } from 'src/inc/inc.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: '#5a3a4a' })
  color: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.tags, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToMany(() => Exp, (exp) => exp.tags)
  exps: Exp[];

  @ManyToMany(() => IncEntity, (inc) => inc.tags)
  incs: IncEntity[];
}
