import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import ItemType from './ItemType';

@Entity()
class TaskMaster extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('integer')
  estimatedDays: string;

  @Column("varchar", { array: true })
  checklist: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => ItemType, type => type.taskList)
  itemType: ItemType;

  
}

export default TaskMaster;
