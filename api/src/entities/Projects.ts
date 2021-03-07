import striptags from 'striptags';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  RelationId,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

import is from 'utils/validation';
import { IssueStatus, IssuePriority } from 'constants/issues';
import { Comment, User } from '.';

@Entity()
class Projects extends BaseEntity {
  static validations = {
    title: [is.required(), is.maxLength(200)],
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
  status: IssueStatus;

  @Column('varchar')
  priority: IssuePriority;

  @Column('double precision')
  listPosition: number;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('text', { nullable: true })
  descriptionText: string | null;

  @Column('timestamp', { nullable: true })
  committedDate: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column('integer')
  reporterId: number;

  @Column('text')
  projectNumber: string;

  @OneToMany(
    () => Comment,
    comment => comment.issue,
  )
  comments: Comment[];

  @ManyToMany(
    () => User,
    user => user.issues,
  )
  @JoinTable()
  users: User[];

  @RelationId((issue: Projects) => issue.users)
  userIds: number[];

  @BeforeInsert()
  @BeforeUpdate()
  setDescriptionText = (): void => {
    if (this.description) {
      this.descriptionText = striptags(this.description);
    }
  };
}

export default Projects;
