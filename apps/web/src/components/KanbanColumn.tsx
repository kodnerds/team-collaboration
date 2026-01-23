import { MoreHorizontal } from 'lucide-react';

import { AddTaskForm } from './AddTaskForm';
import { StatusIndicator } from './StatusIndicator';
import { TaskCard } from './TaskCard';

import type { Column, Task, TaskStatus } from '@/types/kanban';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (title: string, description: string, columnId: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: TaskStatus) => void;
  onAssignUser: (taskId: string, userId: string | null) => Promise<void>;
}

export const KanbanColumn = ({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onDragStart,
  onDragOver,
  onDrop,
  onAssignUser
}: KanbanColumnProps) => (
  <div
    className="flex flex-col min-w-[320px] max-w-[320px] bg-gray-50 rounded-xl"
    onDragOver={onDragOver}
    onDrop={(e) => onDrop(e, column.id)}
  >
    {/* Column Header */}
    <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200/50">
      <div className="flex items-center gap-2">
        <StatusIndicator status={column.id} />
        <h3 className="font-semibold text-sm text-gray-900">{column.title}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
      <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>

    {/* Column Description */}
    <p className="px-3 py-2 text-xs text-gray-500">{column.description}</p>

    {/* Tasks List */}
    <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto scrollbar-thin max-h-[calc(100vh-280px)]">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onDragStart={onDragStart}
          onAssignUser={onAssignUser}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>

    {/* Add Task Form */}
    <div className="px-2 pb-3 mt-auto">
      <AddTaskForm columnId={column.id} onAdd={onAddTask} />
    </div>
  </div>
);
