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
import TaskMasterGroup from './TaskMasterGroup';
@Entity()
class TaskMaster extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(200)],
    estimatedDays: [is.required()],
  };
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('integer', { nullable: true})
  estimatedDays: string;

  @Column("simple-array", { nullable: true })
  checklist: string[];

  @ManyToOne(() => TaskMasterGroup, tmg => tmg.subtasks)
  group: TaskMasterGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  
}

export default TaskMaster;
