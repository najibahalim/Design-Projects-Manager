import { Projects, Task } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, findEntities, updateEntity, findEntityOrThrow } from 'utils/typeorm';
import { getGroupsList } from './tasksMaster';

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
  const [project, groups] = await Promise.all([findEntityOrThrow(Projects, req.params.projectId, {
    relations: ['items', 'items.tasks', 'items.tasks.comments', 'items.tasks.comments.user', 'items.tasks.revisions']
  }), getGroupsList() ]);
  const formattedProject: any = project;
  formattedProject.items.forEach((item: any) => {
    const groupsWithTasks : {id: number, name: string, tasks: Task[]}[] = [];
    item.tasks.forEach((task: any)=> {
      const existingGrp = groupsWithTasks.find(grp => grp.id === task.groupID);
      task.projectId = req.params.projectId;
      task.userId = task.assigneeId;
      task.itemId = item.id;
      if (existingGrp) {
        existingGrp.tasks.push(task);
      } else {
        groupsWithTasks.push({
          id: task.groupID,
          name: groups.find(grp => grp.id === task.groupID)?.name || "",
          tasks:[task]
        });
      }
    });
    item.tasks = undefined;
    item.taskGroups = groupsWithTasks;
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
