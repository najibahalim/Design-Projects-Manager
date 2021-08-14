import { TaskStatus } from 'constants/projects';
import { Issue, Item, Task, TaskHistory, Users } from 'entities';
import { catchErrors } from 'errors';
import { captureNewTask, saveHistory, trackAutomaticUpdates } from 'utils/history';
import { deleteEntity, createEntity, findEntityOrThrow, validateAndSaveEntity, findEntities } from 'utils/typeorm';


export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issue = await findEntityOrThrow(Issue, req.params.issueId, {
    relations: ['users', 'comments', 'comments.user'],
  });
  res.respond({ issue });
});

export const create = catchErrors(async (req, res) => {
  const tasks = [];
  for(const taskBody of req.body) {
    const taskCreationBody: Task = new Task();
    taskCreationBody.name = taskBody.name;
    taskCreationBody.description = taskBody.description;
    taskCreationBody.priority = taskBody.priority;
    taskCreationBody.status = TaskStatus.NOTSTARTED;
    taskCreationBody.estimatedDays = taskBody.estimatedDays;
    taskCreationBody.actualDays = taskBody.actualDays;
    taskCreationBody.taskMasterId = taskBody.taskMasterId;
    taskCreationBody.checklist = taskBody.checklist;
    taskCreationBody.groupID = taskBody.groupID;
    if (taskBody.isRevision && taskBody.mainTaskId) {
      taskCreationBody.isRevision = true;
      taskCreationBody.revisionType = taskBody.revisionType;
      taskCreationBody.mainTask = await findEntityOrThrow(Task, taskBody.mainTaskId);
      taskCreationBody.mainTaskId = taskCreationBody.mainTask.id;
    }
    const [taskItem, taskUser] = await Promise.all([
      findEntityOrThrow(Item, taskBody.itemId),
      findEntityOrThrow(Users, taskBody.userId)
    ]);
    taskCreationBody.item = taskItem;
    taskCreationBody.assignee = taskUser;
    const task = await createEntity(Task, taskCreationBody);
    taskBody.action = 'Created';
    await captureNewTask(taskCreationBody, taskBody, task.id, req.currentUser.id);
    tasks.push(task);
   
  }
  res.respond({ tasks });
  
});

export const update = catchErrors(async (req, res) => {

  if(!req.body.action) {
    return res.status(400).json({message:"Missing Action"});
  }
  const taskCreationBody: Task = new Task();
  taskCreationBody.id = req.body.id,
  taskCreationBody.name = req.body.name;
  taskCreationBody.description = req.body.description;
  taskCreationBody.priority = req.body.priority;
  taskCreationBody.estimatedDays = req.body.estimatedDays;
  taskCreationBody.actualDays = req.body.actualDays;
  taskCreationBody.taskMasterId = req.body.taskMasterId;
  taskCreationBody.checklist = req.body.checklist;
  taskCreationBody.groupID = req.body.groupID;
  taskCreationBody.status = req.body.status;
  const [taskItem, taskUser] = await Promise.all([
    findEntityOrThrow(Item, req.body.itemId),
    findEntityOrThrow(Users, req.body.userId)
  ]);
  if (taskCreationBody.status === TaskStatus.INPROGRESS && taskCreationBody.prevStatus !== TaskStatus.INPROGRESS) {
    await markHoldTasksInProgress(req.body.userId, req.currentUser.id);
  }
  taskCreationBody.item = taskItem;
  taskCreationBody.assignee = taskUser;
  const task = await validateAndSaveEntity(taskCreationBody);
  await saveHistory(taskCreationBody, req, task.id);


  res.respond({ task });
});

const markHoldTasksInProgress = async (userId: number, currentUserId: number) => {
  const tasks = await findEntities(Task, {
    relations: ['assignee'],
    loadRelationIds: true,
    where: [{ assignee: { id: userId }, status: TaskStatus.INPROGRESS }],
  });
  for(const task of tasks) {
    task.status = TaskStatus.ONHOLD;
    const updatedTask = await validateAndSaveEntity(task);
    await trackAutomaticUpdates(updatedTask, currentUserId)
  }

}

export const remove = catchErrors(async (req, res) => {
  const issue = await deleteEntity(Issue, req.params.issueId);
  res.respond({ issue });
});

export const getTaskHistory = catchErrors(async (req, res) => {
  const projectId = req.params.projectId;

  const history = await TaskHistory.find({
    where: [{ projectId }],
    order: {
      createdAt: "DESC"
    }
  });
  res.respond(history);
});
