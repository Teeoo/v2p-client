export interface TaskType {
    [keys: string]: TaskObj | SubObj
}

export interface TaskObj {
    id: string
    name: string
    type: string
    time: string
    job: Job
    running: boolean
}

export interface SubObj {
    name: string
    type: string
    job: Job
    id: string
}

export interface Job {
    type: string
    target: string
}

export interface TaskSub {
    name: string;
    desc: string;
    date: string;
    type: string;
    author: string;
    resource: string;
    list: TaskObj[];
}