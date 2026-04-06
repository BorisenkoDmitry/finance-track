import { User } from 'src/auth/auth.entity';
import { TagEntity } from 'src/tags/tags.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => TagEntity, (tag) => tag.incs)
  @JoinTable({
    name: 'inc_tags',
    joinColumn: { name: 'inc_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];
}
