import { Task } from '../../models/task.model';
//définit la structure initiale du store.

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: []
};
