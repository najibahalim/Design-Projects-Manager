import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import is from 'utils/validation';


@Entity()
class TaskHistory extends BaseEntity {
  static validations = {
    userId: [is.required()],
    action: [is.required()]
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  taskId: number;

  @Column('integer')
  groupId: number;

  @Column('integer')
  itemId: number;

  @Column('integer')
  projectId: number;

  @Column('integer', {nullable: true})
  assigneeId: number;

  @Column('integer')
  userId: number;

  @Column('varchar')
  action: string;


  @CreateDateColumn()
  createdAt: Date;
  
}

export default TaskHistory;
