export { default as Comment } from './Comment';
export { default as Issue } from './Issue';
export { default as Project } from './Project';
export { default as User } from './User';

// select p.PROJECTID, p.PROJECT_NAME, a.ACC_ID, a.ACC_NAME from PROJECT as p JOIN ACCOUNT as a on a.ACC_ID = p.ACC_ID;
