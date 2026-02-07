import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../auth.entity';

@Entity({ name: 'tokens' })
@Unique(['token'])
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  exp: Date;

  // внешний ключ к пользователю
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
