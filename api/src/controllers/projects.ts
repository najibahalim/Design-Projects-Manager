import { Projects } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, findEntities, updateEntity, findEntityOrThrow } from 'utils/typeorm';

export const getProjectsWithUsers = catchErrors(async (req, res) => {
  console.log(req.currentUser.id);
  const project = await findEntities(Projects, {
    order: {
      updatedAt: "DESC",
    },
    select: [
      "name",
      "status",
      "priority",
      "description",
      "reporterId",
      "id",
      "listPosition",
      "committedDate"
    ]
  });
  res.respond({
    projects: project
  });
});

export const getProjectWithId = catchErrors(async (req, res) => {
  console.log(req.params.projectId);
  const project = await findEntityOrThrow(Projects, req.params.projectId, {
    relations: ['items', 'items.tasks']
  });
  res.respond(project);
});

export const update = catchErrors(async (req, res) => {
  const project = await updateEntity(Projects, req.body.id, req.body);
  res.respond({ project });
});

export const create = catchErrors(async (req, res) => {
  const project = await createEntity(Projects, req.body);
  res.respond({ project });
});
