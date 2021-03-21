import * as authentication from 'controllers/authentication';
import * as comments from 'controllers/comments';
import * as issues from 'controllers/issues';
import * as project from 'controllers/project';
import * as projects from 'controllers/projects';
import * as items from 'controllers/items';
import * as tasks from 'controllers/tasks';
import * as tasksMaster from 'controllers/tasksMaster';
import * as test from 'controllers/test';
import * as users from 'controllers/users';

export const attachPublicRoutes = (app: any): void => {
  if (process.env.NODE_ENV === 'test') {
    app.delete('/test/reset-database', test.resetDatabase);
    app.post('/test/create-account', test.createAccount);
  }

  app.post('/authentication/guest', authentication.createGuestAccount);
};

export const attachPrivateRoutes = (app: any): void => {
  app.post('/comments', comments.create);
  app.put('/comments/:commentId', comments.update);
  app.delete('/comments/:commentId', comments.remove);

  app.get('/issues', issues.getProjectIssues);
  app.get('/issues/:issueId', issues.getIssueWithUsersAndComments);
  app.post('/issues', issues.create);
  app.put('/issues/:issueId', issues.update);
  app.delete('/issues/:issueId', issues.remove);

  app.get('/project', project.getProjectWithUsersAndIssues);
  app.put('/project', project.update);

  app.get('/projects', projects.getProjectsWithUsers);
  app.get('/projects/:projectId', projects.getProjectWithId);
  app.put('/projects', projects.update);
  app.post('/projects', projects.create);

  app.post('/item', items.create);

  app.post('/tasksMaster', tasksMaster.create);
  app.put('/tasksMaster', tasksMaster.update);
  app.get('/tasksMaster', tasksMaster.getAllTasks);

  app.post('/items', items.create); //Add item to project
  app.put('/items', items.update); // update item

  app.post('/tasks', tasks.create); //Add item to project
  app.put('/tasks', tasks.update); // update item

  app.post('/users', users.create); //Add Users
  app.put('/users', users.update); // update Users
  app.get('/users', users.getAllUsers); // get all

  app.get('/currentUser', users.getCurrentUser);
};
