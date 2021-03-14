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

import is from 'utils/validation';
import { Comment } from '.';
@Entity()
class Task extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(200)],
    estimatedDays: [is.required()],
  };
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('integer')
  estimatedDays: string;

  @Column('integer', {nullable: true})
  actualDays: string;

  @Column('integer', { nullable: true })
  variance: string;

  @Column("varchar", { array: true, nullable: true })
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
