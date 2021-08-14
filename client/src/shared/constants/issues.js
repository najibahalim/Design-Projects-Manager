export const IssueType = {
    TASK: 'task',
    BUG: 'bug',
    STORY: 'story',
};

export const IssueStatus = {
    BACKLOG: 'backlog',
    SELECTED: 'selected',
    INPROGRESS: 'inprogress',
    DONE: 'done',
    REVISION: 'revision'
};

export const TaskStatus = {
    ONHOLD: 'On Hold',
    NOTSTARTED: 'Not Started',
    INPROGRESS: 'In Progress',
    DONE: 'Done',
    REVISION: 'Revision'
};

export const TaskStatusCopy = {
    [TaskStatus.ONHOLD]: 'On Hold',
    [TaskStatus.NOTSTARTED]: 'Not Started',
    [TaskStatus.INPROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
    [TaskStatus.REVISION]: 'Revision'

};

export const IssuePriority = {
    HIGHEST: '5',
    HIGH: '4',
    MEDIUM: '3',
    LOW: '2',
    LOWEST: '1',
};

export const IssueTypeCopy = {
    [IssueType.TASK]: 'Task',
    [IssueType.BUG]: 'Bug',
    [IssueType.STORY]: 'Story',
};

export const IssueStatusCopy = {
    [IssueStatus.BACKLOG]: 'Backlog',
    [IssueStatus.SELECTED]: 'Selected for development',
    [IssueStatus.INPROGRESS]: 'In progress',
    [IssueStatus.DONE]: 'Done',
};

export const IssuePriorityCopy = {
    [IssuePriority.HIGHEST]: 'Highest',
    [IssuePriority.HIGH]: 'High',
    [IssuePriority.MEDIUM]: 'Medium',
    [IssuePriority.LOW]: 'Low',
    [IssuePriority.LOWEST]: 'Lowest',
};