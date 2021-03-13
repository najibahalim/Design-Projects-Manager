import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import TaskMaster from './TaskMaster';

@Entity()
class ItemType extends BaseEntity {


  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => TaskMaster, taskMaster => taskMaster.itemType)
  taskList: TaskMaster[];
}

export default ItemType;
