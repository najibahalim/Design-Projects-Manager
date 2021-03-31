import { TaskStatus } from 'constants/projects';
import { Issue, Item, Task, Users } from 'entities';
import { catchErrors } from 'errors';
import { saveHistory } from 'utils/history';
import { deleteEntity, createEntity, findEntityOrThrow, validateAndSaveEntity } from 'utils/typeorm';


export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issue = await findEntityOrThrow(Issue, req.params.issueId, {
    relations: ['users', 'comments', 'comments.user'],
  });
  res.respond({ issue });
});

export const create = catchErrors(async (req, res) => {
  const taskCreationBody: Task = new Task();
  taskCreationBody.name = req.body.name,
  taskCreationBody.priority = req.body.priority;
  taskCreationBody.status = TaskStatus.NOTSTARTED;
  taskCreationBody.estimatedDays = req.body.estimatedDays;
  taskCreationBody.actualDays = req.body.actualDays;
  taskCreationBody.taskMasterId = req.body.taskMasterId;
  taskCreationBody.checklist = req.body.checklist;
  taskCreationBody.groupID = req.body.groupID;
  const [taskItem, taskUser] = await Promise.all([
    findEntityOrThrow(Item, req.body.itemId),
    findEntityOrThrow(Users, req.body.userId)
  ]);
  taskCreationBody.item = taskItem;
  taskCreationBody.assignee = taskUser;
  const task = await createEntity(Task, taskCreationBody);
  req.body.action = 'Created';
  await saveHistory(taskCreationBody, req, task.id);
  res.respond({ task });
});

export const update = catchErrors(async (req, res) => {

  if(!req.body.action) {
    return res.status(400).json({message:"Missing Action"});
  }
  const taskCreationBody: Task = new Task();
  taskCreationBody.id = req.body.id,
  taskCreationBody.name = req.body.name,
  taskCreationBody.priority = req.body.priority;
  taskCreationBody.estimatedDays = req.body.estimatedDays;
  taskCreationBody.actualDays = req.body.actualDays;
  taskCreationBody.taskMasterId = req.body.taskMasterId;
  taskCreationBody.checklist = req.body.checklist;
  taskCreationBody.groupID = req.body.groupID;
  const [taskItem, taskUser] = await Promise.all([
    findEntityOrThrow(Item, req.body.itemId),
    findEntityOrThrow(Users, req.body.userId)
  ]);
  taskCreationBody.item = taskItem;
  taskCreationBody.assignee = taskUser;
  const task = await validateAndSaveEntity(taskCreationBody);
  await saveHistory(taskCreationBody, req, task.id);
  res.respond({ task });
});

export const remove = catchErrors(async (req, res) => {
  const issue = await deleteEntity(Issue, req.params.issueId);
  res.respond({ issue });
});
