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

  @Column('varchar', { nullable: true })
  description: string;


  @Column('varchar')
  status: TaskStatus;


  @Column('varchar', {nullable: true})
  prevStatus: TaskStatus;

  @Column('varchar')
  priority: IssuePriority;

  @Column('integer')
  estimatedDays: number;

  @Column('integer', {nullable: true})
  actualDays: number;

  @Column('tinyint', { default: false })
  isRevision: boolean;

  @Column('varchar', { nullable: true })
  revisionType: "INTERNAL" | "EXTERNAL";

  @Column('integer', { nullable: true })
  variance: number;

  @Column("simple-json", { nullable: true })
  checklist: {label: string, isChecked: boolean}[];

  @Column('integer')
  taskMasterId: number;

  @Column('integer', { nullable: true })
  groupID: number;

  @Column()
  startedOn: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Item, item => item.tasks)
  item: Item;

  @ManyToOne(() => Task, task => task.revisions)
  mainTask: Task;

  @Column('integer', { nullable: true })
  mainTaskId: number;

  @ManyToOne(() => Users, user => user.tasks)
  assignee: Users;
  @RelationId((task: Task) => task.assignee)
  assigneeId: number;
  
  @OneToMany(
    () => Comment,
    comment => comment.task,
  )
  comments: Comment[];


  @OneToMany(
    () => Task,
    task => task.mainTask,
  )
  revisions: Task[];
 
  @BeforeInsert()
  @BeforeUpdate()
  setVariance = (): void => {
    if(this.status === TaskStatus.INPROGRESS && this.prevStatus !== TaskStatus.INPROGRESS) {
      this.startedOn = new Date();
    } else if ((this.status === TaskStatus.NOTSTARTED || this.status === TaskStatus.DONE || this.status === TaskStatus.ONHOLD ) && this.prevStatus === TaskStatus.INPROGRESS) {
      const currentDate = new Date();
      this.actualDays += Math.round((currentDate.getTime() - this.startedOn.getTime()) / (1000 * 60 * 60 * 24));
    }
    this.prevStatus = this.status;
    const diff = (this.actualDays ?? 0) - this.estimatedDays;
    this.variance = diff > 0 ? diff : 0;
  };
}

export default Task;
