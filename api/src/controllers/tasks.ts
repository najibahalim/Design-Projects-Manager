import { Issue, Item, Task, Users } from 'entities';
import { catchErrors } from 'errors';
import { deleteEntity, createEntity, findEntityOrThrow, validateAndSaveEntity } from 'utils/typeorm';


export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issue = await findEntityOrThrow(Issue, req.params.issueId, {
    relations: ['users', 'comments', 'comments.user'],
  });
  res.respond({ issue });
});

export const create = catchErrors(async (req, res) => {
  const taskCreationBody: Task = new Task();
  taskCreationBody.id = req.body.id,
  taskCreationBody.name = req.body.name,
  taskCreationBody.priority = req.body.priority;
  taskCreationBody.status = req.body.status;
  taskCreationBody.estimatedDays = req.body.estimatedDays;
  taskCreationBody.actualDays = req.body.actualDays;
  taskCreationBody.taskMasterId = req.body.taskMasterId;
  taskCreationBody.checklist = req.body.checklist;
  const [taskItem, taskUser] = await Promise.all([
    findEntityOrThrow(Item, req.body.itemId),
    findEntityOrThrow(Users, req.body.userId)
  ]);
  taskCreationBody.item = taskItem;
  taskCreationBody.assignee = taskUser;
  const task = await createEntity(Task, taskCreationBody);
  res.respond({ task });
});

export const update = catchErrors(async (req, res) => {
  const taskCreationBody: Task = new Task();
  taskCreationBody.id = req.body.id,
    taskCreationBody.name = req.body.name,
    taskCreationBody.priority = req.body.priority;
  taskCreationBody.estimatedDays = req.body.estimatedDays;
  taskCreationBody.actualDays = req.body.actualDays;
  taskCreationBody.taskMasterId = req.body.taskMasterId;
  taskCreationBody.checklist = req.body.checklist;
  const [taskItem, taskUser] = await Promise.all([
    findEntityOrThrow(Item, req.body.itemId),
    findEntityOrThrow(Users, req.body.userId)
  ]);
  taskCreationBody.item = taskItem;
  taskCreationBody.assignee = taskUser;
  const task = await validateAndSaveEntity(taskCreationBody);
  res.respond({ task });
});

export const remove = catchErrors(async (req, res) => {
  const issue = await deleteEntity(Issue, req.params.issueId);
  res.respond({ issue });
});
