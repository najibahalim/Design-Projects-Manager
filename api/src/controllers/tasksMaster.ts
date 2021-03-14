import { TaskMaster } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, findEntities, updateEntity} from 'utils/typeorm';

export const getAllTasks = catchErrors(async (req, res) => {
  console.log(req.currentUser);
  const taskMasterData = await findEntities(TaskMaster, {
    order: {
      updatedAt: "DESC",
    },
  });
  res.respond(taskMasterData);
});

export const update = catchErrors(async (req, res) => {

  const updatedTask = await updateEntity(TaskMaster, req.body.id, req.body);
  res.respond(updatedTask);
});


export const create = catchErrors(async (req, res) => {
  const newTask = await createEntity(TaskMaster,req.body);
 
  res.respond(newTask);
});
