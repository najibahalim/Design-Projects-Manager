import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import is from 'utils/validation';
import TaskMaster from './TaskMaster';
@Entity()
class TaskMasterGroup extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(200)],
  };
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => TaskMaster,
    task => task.group,
  )
  subtasks: TaskMaster[];



}

export default TaskMasterGroup;
