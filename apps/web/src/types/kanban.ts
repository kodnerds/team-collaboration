export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'in_review' | 'approved' | 'done';

export interface CreatedBy {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdBy: CreatedBy;
  assignedUser?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  description: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', description: 'Items that need to be prioritized' },
  { id: 'todo', title: 'To Do', description: 'Ready to be picked up' },
  { id: 'doing', title: 'In Progress', description: 'Currently being worked on' },
  { id: 'in_review', title: 'Review', description: 'Awaiting review' },
  { id: 'approved', title: 'Approved', description: 'Awaiting review' },
  { id: 'done', title: 'Done', description: 'Completed items' }
];
