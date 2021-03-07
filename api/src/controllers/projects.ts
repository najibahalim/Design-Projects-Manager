import { Projects } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, findEntities, updateEntity } from 'utils/typeorm';

export const getProjectsWithUsers = catchErrors(async (req, res) => {
  console.log(req.currentUser.projectId);
  const project = await findEntities(Projects, {
    relations: ['users'],
  });
  res.respond({
    project: {
      ...project,
    },
  });
});

export const update = catchErrors(async (req, res) => {
  const project = await updateEntity(Projects, req.currentUser.projectId, req.body);
  res.respond({ project });
});

export const create = catchErrors(async (req, res) => {
  const project = await createEntity(Projects, req.body);
  res.respond({ project });
});
