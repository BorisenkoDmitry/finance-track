import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExpDetail } from './expDetail/expdetail.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/auth/auth.entity';
import { CatalogEntity } from 'src/catalogs/catalogs.entity';

@Entity()
export class Exp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 13, scale: 2 })
  price: string;

  @Column()
  descr: string;

  @Column()
  date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @OneToMany(() => ExpDetail, (expDetail) => expDetail.exp)
  products: ExpDetail[];

  @ManyToOne(() => User, (u) => u.exps, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => CatalogEntity, (u) => u.exps, {
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
