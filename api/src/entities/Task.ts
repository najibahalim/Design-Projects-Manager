import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  RelationId,
} from 'typeorm';
import Item from './Item';

import is from 'utils/validation';
import {IssuePriority } from 'constants/issues';

import { Comment } from '.';
import Users from './Users';
import { TaskStatus } from 'constants/projects';
@Entity()
class Task extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(200)],
    estimatedDays: [is.required()],
    status: [is.required(), is.oneOf(Object.values(TaskStatus))],
    priority: [is.required(), is.oneOf(Object.values(IssuePriority))],


  };
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  status: TaskStatus;

  @Column('varchar')
  priority: IssuePriority;

  @Column('integer')
  estimatedDays: number;

  @Column('integer', {nullable: true})
  actualDays: number;

  @Column('integer', { nullable: true })
  variance: number;

  @Column("simple-array", { nullable: true })
  checklist: string[];

  @Column('integer')
  taskMasterId: number;


  @Column('integer', { nullable: true })
  groupID: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Item, item => item.tasks)
  item: Item;

  @ManyToOne(() => Users, user => user.tasks)
  assignee: Users;
  @RelationId((task: Task) => task.assignee)
  assigneeId: number;
  
  @OneToMany(
    () => Comment,
    comment => comment.issue,
  )
  comments: Comment[];
  
  @BeforeInsert()
  @BeforeUpdate()
  setVariance = (): void => {
    const diff = (this.actualDays ?? 0) - this.estimatedDays;
    this.variance = diff > 0 ? diff : 0;
  };
}

export default Task;
