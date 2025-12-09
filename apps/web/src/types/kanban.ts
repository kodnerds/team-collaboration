export type ColumnId = 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
  createdAt: Date;
}

export interface Column {
  id: ColumnId;
  title: string;
  description: string;
}

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', description: 'Items that need to be prioritized' },
  { id: 'todo', title: 'To Do', description: 'Ready to be picked up' },
  { id: 'inprogress', title: 'In Progress', description: 'Currently being worked on' },
  { id: 'review', title: 'Review', description: 'Awaiting review' },
  { id: 'done', title: 'Done', description: 'Completed items' },
];

