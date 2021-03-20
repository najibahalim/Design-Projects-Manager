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
import {IssueStatus, IssuePriority } from 'constants/issues';

import { Comment } from '.';
import Users from './Users';
@Entity()
class Task extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(200)],
    estimatedDays: [is.required()],
    status: [is.required(), is.oneOf(Object.values(IssueStatus))],
    priority: [is.required(), is.oneOf(Object.values(IssuePriority))],


  };
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  status: IssueStatus;

  @Column('varchar')
  priority: IssuePriority;

  @Column('integer')
  estimatedDays: string;

  @Column('integer', {nullable: true})
  actualDays: string;

  @Column('integer', { nullable: true })
  variance: string;

  @Column("simple-array", { nullable: true })
  checklist: string[];

  @Column('integer')
  taskMasterId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Item, item => item.tasks)
  item: Item;

  @ManyToOne(() => Users, user => user.tasks)
  assignee: Users;

  @OneToMany(
    () => Comment,
    comment => comment.issue,
  )
  comments: Comment[];
  
}

export default Task;
