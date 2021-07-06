import {  Item, Projects, Task, TaskHistory, TaskMasterGroup, Users } from 'entities';
import { catchErrors } from 'errors';
import { Between, In } from 'typeorm';
import { findEntities } from 'utils/typeorm';
import { getGroupsList } from './tasksMaster';

export const getTaskReport = catchErrors(async (req, res) => {
  const taskId = req.query.id;
  const history = await TaskHistory.find({
    where: [{ taskId}],
    order: {
      createdAt: "ASC"
    }
  });
  const userIdList = new Set<number>();

  history.forEach(item => {
    userIdList.add(item.userId);
  });
  const [userIdMap] = await Promise.all([getUserNamesWithIds(Array.from(userIdList))]);
 
  const report: any = [];
  history.forEach(item => {
   report.push({
     User: userIdMap.get(item.userId) || 'Undefined',
     Date: new Date(item.createdAt).toLocaleDateString("en-GB", { month: 'long', year: "numeric", day: "numeric" }),
     Action: item.action
   });
  });

  res.respond(report);
});

export const getAssigneeReport = catchErrors(async (req, res) => {
  const assigneeId = req.query.id;
  let fromDate = new Date(req.query.fromDate); 
  let toDate = new Date(req.query.toDate); 
  if(!fromDate.getTime()) {
    fromDate = new Date(-8640000000000000);
  }
  if (!toDate.getTime()) {
    toDate = new Date(8640000000000000);
  }
  const history = await TaskHistory.find({
    where: [{ assigneeId, createdAt: Between(fromDate, toDate)}],
    order: {
      createdAt: "ASC"
    }
  });
  const userIdList = new Set<number>();
  const taskIdList = new Set<number>();
  const groupIdList = new Set<number>();
  const itemIdList = new Set<number>();
  const projectIdList = new Set<number>();

  history.forEach(item => {
    userIdList.add(item.userId);
    taskIdList.add(item.taskId);
    groupIdList.add(item.groupId);
    itemIdList.add(item.itemId);
    projectIdList.add(item.projectId);
  });
  const [userIdMap, taskIdMap, itemIdMap, groupIdMap, projectIdMap] = await Promise.all([getUserNamesWithIds(Array.from(userIdList)), 
  getTaskNamesWithIds(Array.from(taskIdList)),
    getItemNamesWithIds(Array.from(itemIdList)),
    getGroupNamesWithIds(Array.from(groupIdList)),
    getProjectNamesWithIds(Array.from(projectIdList))]);
 
  const report: any = [];
  history.forEach(item => {
   report.push({
     Project: projectIdMap.get(item.projectId) || 'Undefined',
     Item: itemIdMap.get(item.itemId) || 'Undefined',
     TaskGroup: groupIdMap.get(item.groupId) || 'Undefined',
     Task: taskIdMap.get(item.taskId) || 'Undefined',
     User: userIdMap.get(item.userId) || 'Undefined',
     Date: new Date(item.createdAt).toLocaleDateString("en-GB", { month: 'long', year: "numeric", day: "numeric" }),
     Action: item.action
   });
  });

  res.respond(report);
});

export const getGroupReport = catchErrors(async (req, res) => {
  const groupId = req.query.id;
  const itemId = req.query.item;
  const history = await TaskHistory.find({
    where: [{ groupId, itemId }],
    order: {
      createdAt: "ASC"
    }
  });
  const userIdList = new Set<number>();
  const taskIdList = new Set<number>();

  history.forEach(item => {
    userIdList.add(item.userId);
    taskIdList.add(item.taskId);
  });
  const [userIdMap, taskIdMap] = await Promise.all([getUserNamesWithIds(Array.from(userIdList)),
                                        getTaskNamesWithIds(Array.from(taskIdList))]);

  const report: any = [];
  history.forEach(item => {
    report.push({
      Task: taskIdMap.get(item.taskId) || 'Undefined',
      User: userIdMap.get(item.userId) || 'Undefined',
      Date: new Date(item.createdAt).toLocaleDateString("en-GB", { month: 'long', year: "numeric", day: "numeric" }),
      Action: item.action
    });
  });

  res.respond(report);
});

export const getItemReport = catchErrors(async (req, res) => {
  const itemId = req.query.id;
  const history = await TaskHistory.find({
    where: [{ itemId }],
    order: {
      createdAt: "ASC"
    }
  });
  const userIdList = new Set<number>();
  const taskIdList = new Set<number>();
  const groupIdList = new Set<number>();

  history.forEach(item => {
    userIdList.add(item.userId);
    taskIdList.add(item.taskId);
    groupIdList.add(item.groupId);
  });
  const [userIdMap, taskIdMap, groupIdMap] = await Promise.all([getUserNamesWithIds(Array.from(userIdList)),
  getTaskNamesWithIds(Array.from(taskIdList)),
    getGroupNamesWithIds(Array.from(groupIdList))]);

  const report: any = [];
  history.forEach(item => {
    report.push({
      TaskGroup: groupIdMap.get(item.groupId) || 'Undefined',
      Task: taskIdMap.get(item.taskId) || 'Undefined',
      User: userIdMap.get(item.userId) || 'Undefined',
      Date: new Date(item.createdAt).toLocaleDateString("en-GB", { month: 'long', year: "numeric", day: "numeric" }),
      Action: item.action
    });
  });

  res.respond(report);
});

export const getProjectReport = catchErrors(async (req, res) => {
  const projectId = req.query.id;
  const history = await TaskHistory.find({
    where: [{ projectId }],
    order: {
      createdAt: "ASC"
    }
  });
  const userIdList = new Set<number>();
  const taskIdList = new Set<number>();
  const groupIdList = new Set<number>();
  const itemIdList = new Set<number>();

  history.forEach(item => {
    userIdList.add(item.userId);
    taskIdList.add(item.taskId);
    groupIdList.add(item.groupId);
    itemIdList.add(item.itemId);
  });
  const [userIdMap, taskIdMap, groupIdMap, itemIdMap] = await Promise.all([getUserNamesWithIds(Array.from(userIdList)),
  getTaskNamesWithIds(Array.from(taskIdList)),
    getGroupNamesWithIds(Array.from(groupIdList)),
    getItemNamesWithIds(Array.from(itemIdList))
  ]);

  const report: any = [];
  history.forEach(item => {
    report.push({
      ItemName: itemIdMap.get(item.itemId) || 'Undefined',
      TaskGroup: groupIdMap.get(item.groupId) || 'Undefined',
      Task: taskIdMap.get(item.taskId) || 'Undefined',
      User: userIdMap.get(item.userId) || 'Undefined',
      Date: new Date(item.createdAt).toLocaleDateString("en-GB", { month: 'long', year: "numeric", day: "numeric" }),
      Action: item.action
    });
  });

  res.respond(report);
});



const getUserNamesWithIds = async (userIds: number[]): Promise<Map<number, string>> => {
  const users = await findEntities(Users, {
    order: {
      updatedAt: "DESC",
    }, select: ["name", "id"],
    where: {
      id: In(userIds)
    }
  });
  const userIdMap = new Map<number, string>();
  users.forEach(user => {
    userIdMap.set(user.id, user.name);
  });
  return userIdMap;
}

const getProjectNamesWithIds = async (projectIds: number[]): Promise<Map<number, string>> => {
  const projects = await findEntities(Projects, {
    order: {
      updatedAt: "DESC",
    }, select: ["name", "id"],
    where: {
      id: In(projectIds)
    }
  });
  const projectIdMap = new Map<number, string>();
  projects.forEach(proj => {
    projectIdMap.set(proj.id, proj.name);
  });
  return projectIdMap;
}

const getGroupNamesWithIds = async (groupIds: number[]): Promise<Map<number, string>> => {
  const groups = await findEntities(TaskMasterGroup, {
    order: {
      updatedAt: "DESC",
    }, select: ["name", "id"],
    where: {
      id: In(groupIds)
    }
  });
  const groupIdMap = new Map<number, string>();
  groups.forEach(group => {
    groupIdMap.set(group.id, group.name);
  });
  return groupIdMap;
}

const getTaskNamesWithIds = async (taskIds: number[]): Promise<Map<number, string>> => {
  const users = await findEntities(Task, {
    order: {
      updatedAt: "DESC",
    }, select: ["name", "id"],
    where: {
      id: In(taskIds)
    }
  });
  const taskIdMap = new Map<number, string>();
  users.forEach(task => {
    taskIdMap.set(task.id, task.name);
  });
  return taskIdMap;
}

const getItemNamesWithIds = async (itemIds: number[]): Promise<Map<number, string>> => {
  const items = await findEntities(Item, {
    order: {
      updatedAt: "DESC",
    }, select: ["id", "itemName"],
    where: {
      id: In(itemIds)
    }
  });
 
  const mapForItemNames = new Map<number, string>();
  items.forEach(item => {
    console.log(JSON.stringify(item));
    mapForItemNames.set(item.id, item.itemName);
    console.log(item.id, item.itemName);
    console.log(JSON.stringify(mapForItemNames.keys()));
    console.log(JSON.stringify(mapForItemNames.size));
    console.log(JSON.stringify(mapForItemNames.values()));
  });

  return mapForItemNames;
}

export const listReportInfo = catchErrors(async (req, res) => {
  console.log(req.query.id);
  const [projects, groups] = await Promise.all([findEntities(Projects, {
    relations: ['items', 'items.tasks'],
  }), getGroupsList()]);
  const projectsData: any[] = [];
  projects.forEach((project) => {
    const projectJSON: any = {};
    projectJSON.id = project.id;
    projectJSON.name = project.name;
    projectJSON.items = [];
    projectsData.push(projectJSON);
    project.items.forEach((item: any) => {
      const itemJSON: any = {
        name: item.itemName,
        id: item.id
      }
      projectJSON.items.push(itemJSON);
      const groupsWithTasks: { id: number, name: string, tasks: any[] }[] = [];
      item.tasks.forEach((task: any) => {
        const existingGrp = groupsWithTasks.find(grp => grp.id === task.groupID);
        if (existingGrp) {
          existingGrp.tasks.push({
            id: task.id,
            name: task.name
          });
        } else {
          groupsWithTasks.push({
            id: task.groupID,
            name: groups.find(grp => grp.id === task.groupID)?.name || "",
            tasks: [{
              id: task.id,
              name: task.name
            }]
          });
        }
      });
      itemJSON.taskGroups = groupsWithTasks;
    });
  })

  res.respond(projectsData);
});


