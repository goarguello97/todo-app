export interface CreateTask {
  userId: string;
  task: string;
}

export interface UpdateTask {
  id?: string;
  task: {
    task?: string;
    done?: boolean;
    userId?: string;
  };
}
