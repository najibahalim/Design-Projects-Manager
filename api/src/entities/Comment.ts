import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import is from 'utils/validation';
import { Issue } from '.';
import Task from './Task';
import Users from './Users';

@Entity()
class Comment extends BaseEntity {
  static validations = {
    body: [is.required(), is.maxLength(50000)],
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => Users,
    user => user.comments,
  )
  user: Users;

  @Column('integer')
  userId: number;

  @ManyToOne(
    () => Task,
    task => task.comments,
    { onDelete: 'CASCADE' },
  )
  task: Issue;

  @Column('integer')
  taskId: number;
}

export default Comment;
