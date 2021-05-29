import { Issue, Item, Projects } from 'entities';
import { catchErrors } from 'errors';
import { deleteEntity, createEntity, findEntityOrThrow, validateAndSaveEntity } from 'utils/typeorm';

export const getProjectIssues = catchErrors(async (req, res) => {
  // const { projectId } = req.currentUser;
  const { searchTerm } = req.query;

  let whereSQL = 'issue.projectId = :projectId';

  if (searchTerm) {
    whereSQL += ' AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)';
  }

  const issues = await Issue.createQueryBuilder('issue')
    .select()
    .where(whereSQL, { projectId: 1, searchTerm: `%${searchTerm}%` })
    .getMany();

  res.respond({ issues });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issue = await findEntityOrThrow(Issue, req.params.issueId, {
    relations: ['users', 'comments', 'comments.user'],
  });
  res.respond({ issue });
});

export const create = catchErrors(async (req, res) => {
  const itemCreationBody: Item = new Item();
  itemCreationBody.id = req.body.id,
  itemCreationBody.itemName =  req.body.itemName,
  itemCreationBody.description = req.body.description;
  const project = await findEntityOrThrow(Projects, req.body.projectId);
  itemCreationBody.project = project;
  const item = await createEntity(Item, itemCreationBody);
  res.respond({ item });
});

export const update = catchErrors(async (req, res) => {
  const itemCreationBody: Item = await findEntityOrThrow(Item, req.body.id);
  itemCreationBody.itemName = req.body.itemName,
  itemCreationBody.description = req.body.description;
  const project = await findEntityOrThrow(Projects, req.body.projectId);
  itemCreationBody.project = project;
  const item = await validateAndSaveEntity(itemCreationBody);
  res.respond({ item });
});

export const remove = catchErrors(async (req, res) => {
  const issue = await deleteEntity(Issue, req.params.issueId);
  res.respond({ issue });
});
