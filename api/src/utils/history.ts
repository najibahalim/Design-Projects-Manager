import { Task } from "entities";
import TaskHistory from "entities/TaskHistory";
import { validateAndSaveEntity } from "./typeorm";

export const saveHistory = async (taskCreationBody: Task, req: any, taskId: number) => {
    const taskHistory = new TaskHistory();
    taskHistory.taskId = taskId,
    taskHistory.itemId = req.body.itemId,
    taskHistory.action = req.body.action,
    taskHistory.assigneeId = req.body.userId,
    taskHistory.groupId = taskCreationBody.groupID,
    taskHistory.projectId = req.body.projectId,
    taskHistory.userId = req.currentUser.id
    return validateAndSaveEntity(taskHistory);
}

export const captureNewTask = async (taskCreationBody: Task, taskReqBody: any, taskId: number, currUserId: number): Promise<TaskHistory> => {
    const taskHistory = new TaskHistory();
    taskHistory.taskId = taskId,
        taskHistory.itemId = taskReqBody.itemId,
        taskHistory.action = 'Created',
        taskHistory.assigneeId = taskReqBody.userId,
        taskHistory.groupId = taskCreationBody.groupID,
        taskHistory.projectId = taskReqBody.projectId,
        taskHistory.userId = currUserId
    return validateAndSaveEntity(taskHistory);
}

