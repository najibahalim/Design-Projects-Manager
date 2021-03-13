import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Item from './Item';

import { Comment } from '.';
@Entity()
class Task extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('integer')
  estimatedDays: string;

  @Column('integer')
  actualDays: string;

  @Column('integer')
  variance: string;

  @Column("varchar", { array: true })
  checklist: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Item, item => item.tasks)
  item: Item;

  @OneToMany(
    () => Comment,
    comment => comment.issue,
  )
  comments: Comment[];
  
}

export default Task;
