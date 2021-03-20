import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { Project, User, Issue, Comment, Projects, ItemType, Task, Item, TaskMaster, Users } from 'entities';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';

type EntityConstructor =
  | typeof Project
  | typeof User
  | typeof Issue
  | typeof Comment
  | typeof Projects
  | typeof ItemType
  | typeof Task
  | typeof Item
  | typeof TaskMaster
  | typeof Users;
type EntityInstance = Project | User | Issue | Comment | Projects | TaskMaster| Item | Task | ItemType | Users;

const entities: { [key: string]: EntityConstructor } = { Comment, Issue, Project, User, Projects, Users };

export const findEntityOrThrow = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  options?: FindOneOptions,
): Promise<InstanceType<T>> => {
  const instance = await Constructor.findOne(id, options);
  if (!instance) {
    throw new EntityNotFoundError(Constructor.name);
  }
  return instance;
};

export const findEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  options?: FindOneOptions,
): Promise<InstanceType<T>> => {
  const instance = await Constructor.findOne(id, options);
  return instance;
};

export const findEntities = async <T extends EntityConstructor>(
  Constructor: T,
  options?: FindOneOptions,
): Promise<InstanceType<T>[]> => {
  const instance = await Constructor.find(options);
  if (!instance) {
    throw new EntityNotFoundError(Constructor.name);
  }
  return instance;
};

export const validateAndSaveEntity = async <T extends EntityInstance>(instance: T): Promise<T> => {
  const Constructor = entities[instance.constructor.name];

  if (Constructor && 'validations' in Constructor) {
    const errorFields = generateErrors(instance, Constructor.validations);

    if (Object.keys(errorFields).length > 0) {
      throw new BadUserInputError({ fields: errorFields });
    }
  }
  return instance.save() as Promise<T>;
};

export const createEntity = async <T extends EntityConstructor>(
  Constructor: T,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = Constructor.create(input);
  return validateAndSaveEntity(instance as InstanceType<T>);
};

export const updateEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  Object.assign(instance, input);
  return validateAndSaveEntity(instance);
};

export const deleteEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  await instance.remove();
  return instance;
};
