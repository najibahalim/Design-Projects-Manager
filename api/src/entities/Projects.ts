import striptags from 'striptags';
import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';

import is from 'utils/validation';
import { IssueStatus, IssuePriority } from 'constants/issues';
import Item from './Item';

@Entity()
class Projects extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(200)],
    status: [is.required(), is.oneOf(Object.values(IssueStatus))],
    priority: [is.required(), is.oneOf(Object.values(IssuePriority))],
    listPosition: is.required(),
    reporterId: is.required(),
  };

  @Column('varchar')
  name: string;

  @Column('varchar')
  status: IssueStatus;

  @Column('varchar')
  priority: IssuePriority;

  @Column('double precision')
  listPosition: number;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('text', { nullable: true })
  descriptionText: string | null;

  @Column('datetime', { nullable: true })
  committedDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('integer')
  reporterId: number;

  @PrimaryColumn('integer',{nullable: false})
  id: number;

  @OneToMany(
    () => Item,
    item => item.project,
  )
  items: Item[];

  @BeforeInsert()
  @BeforeUpdate()
  setDescriptionText = (): void => {
    if (this.description) {
      this.descriptionText = striptags(this.description);
    }
  };
}

export default Projects;
