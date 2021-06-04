import { catchErrors } from 'errors';
import { Users } from 'entities';
import { createEntity, updateEntity } from 'utils/typeorm';

export const getAllUsers = catchErrors(async (req, res) => {
  console.log(req.currentUser.id);
  const users = await Users.createQueryBuilder("user")
              .leftJoinAndSelect("user.tasks", "task", "task.status != :status", {status: "Done"})
              .getMany();

  res.respond(users);
});

export const update = catchErrors(async (req, res) => {
  const user = await updateEntity(Users, req.body.id, req.body);
  res.respond({ user });
});

export const create = catchErrors(async (req, res) => {
  const user = await createEntity(Users, req.body);
  res.respond({ user });
});

export const getCurrentUser = catchErrors((req, res) => {
  res.respond({ currentUser: req.currentUser });
});
