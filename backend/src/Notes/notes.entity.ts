import { Exclude } from 'class-transformer';
import { User } from 'src/auth/auth.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updateAt: Date;

  @Column({
    default: false,
    type: 'boolean',
    name: 'is_completed',
  })
  completed: boolean;

  @Column({
    default: false,
    type: 'boolean',
    name: 'is_deleted',
  })
  isDeleted: boolean;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @ManyToOne(() => User, (u) => u.notes, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user: User;

  @Column()
  @Exclude()
  userId: string;
}
