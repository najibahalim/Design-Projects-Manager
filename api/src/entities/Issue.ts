import striptags from 'striptags';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationId,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

import is from 'utils/validation';
import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';
import { Project, User } from '.';

@Entity()
class Issue extends BaseEntity {
  static validations = {
    title: [is.required(), is.maxLength(200)],
    type: [is.required(), is.oneOf(Object.values(IssueType))],
    status: [is.required(), is.oneOf(Object.values(IssueStatus))],
    priority: [is.required(), is.oneOf(Object.values(IssuePriority))],
    listPosition: is.required(),
    reporterId: is.required(),
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  type: IssueType;

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

  @Column('integer', { nullable: true })
  estimate: number | null;

  @Column('integer', { nullable: true })
  timeSpent: number | null;

  @Column('integer', { nullable: true })
  timeRemaining: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('integer')
  reporterId: number;

  @ManyToOne(
    () => Project,
    project => project.issues,
  )
  project: Project;

  @Column('integer')
  projectId: number;

  @ManyToMany(
    () => User,
    user => user.issues,
  )
  @JoinTable()
  users: User[];

  @RelationId((issue: Issue) => issue.users)
  userIds: number[];

  @BeforeInsert()
  @BeforeUpdate()
  setDescriptionText = (): void => {
    if (this.description) {
      this.descriptionText = striptags(this.description);
    }
  };
}

export default Issue;
