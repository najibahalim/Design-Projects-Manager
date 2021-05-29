import { Project } from 'entities';
import { catchErrors } from 'errors';
import { findEntityOrThrow, updateEntity } from 'utils/typeorm';
import { issuePartial } from 'serializers/issues';

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  console.log(req.body.id);
  const project = await findEntityOrThrow(Project, 1, {
    relations: ['users', 'issues'],
  });
  res.respond({
    project: {
      ...project,
      issues: project.issues.map(issuePartial),
    },
  });
});

export const update = catchErrors(async (req, res) => {
  const project = await updateEntity(Project, 1, req.body);
  res.respond({ project });
});
