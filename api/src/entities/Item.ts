import striptags from 'striptags';
import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';

import is from 'utils/validation';
import { Comment, Task } from '.';
import Projects from './Projects';

@Entity()
class Item extends BaseEntity {
  static validations = {
    ItemID: [is.required()],
    itemName: [is.required(), is.maxLength(200)]
  };

  @PrimaryColumn('integer')
  id: number;

  @Column('varchar')
  itemName: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('text', { nullable: true })
  descriptionText: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Projects, project => project.items)
  project: Projects;

  @OneToMany(
    () => Task,
    task => task.item,
  )
  tasks: Task[];


  @OneToMany(
    () => Comment,
    comment => comment.task,
  )
  comments: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  setDescriptionText = (): void => {
    if (this.description) {
      this.descriptionText = striptags(this.description);
    }
  };
}

export default Item;
