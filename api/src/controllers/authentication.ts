import { catchErrors } from 'errors';
import { signToken } from 'utils/authToken';
import createAccount from 'database/createGuestAccount';
import { Users } from 'entities';

export const createGuestAccount = catchErrors(async (_req, res) => {
  const user = await createAccount();
  res.respond({
    authToken: signToken({ sub: user.id }),
  });
});

const getUserAccount = async (id: string, password: string): Promise<Users> => {
  return Users.findOneOrFail({
    where: [{ id, password }],
  });
};


export const login = catchErrors(async (_req, res) => {
  const user = await getUserAccount(_req.body.id, _req.body.password);
  res.respond({
    authToken: signToken({ sub: user.id }),
    name: user.name
  });
});



