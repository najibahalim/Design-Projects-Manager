import { TaskMaster, TaskMasterGroup } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, findEntities, findEntityOrThrow, updateEntity} from 'utils/typeorm';

export const update = catchErrors(async (req, res) => {
  req.body.group = await findEntityOrThrow(TaskMasterGroup, req.body.grpId);
  const updatedTask = await updateEntity(TaskMaster, req.body.id, req.body);
  res.respond(updatedTask);
});


export const create = catchErrors(async (req, res) => {
  req.body.group = await findEntityOrThrow(TaskMasterGroup, req.body.grpId);
  const newTask = await createEntity(TaskMaster,req.body);
 
  res.respond(newTask);
});

export const getAllTaskGrps = catchErrors(async (req, res) => {
  console.log(req.currentUser);
  const taskMasterData = await findEntities(TaskMasterGroup, {
    order: {
      updatedAt: "DESC",
    },
    relations: ['subtasks']
  });
  res.respond(taskMasterData);
});

export const updateGrp = catchErrors(async (req, res) => {

  const updatedTask = await updateEntity(TaskMasterGroup, req.body.id, req.body);
  res.respond(updatedTask);
});


export const createGrp = catchErrors(async (req, res) => {
  const newTask = await createEntity(TaskMasterGroup, req.body);

  res.respond(newTask);
});
