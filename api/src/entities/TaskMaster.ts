import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import is from 'utils/validation';
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

  @Column("varchar", { array: true, nullable: true })
  checklist: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  
}

export default TaskMaster;
