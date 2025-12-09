import type { Column, Task, ColumnId } from "@/types/kanban";
import { MoreHorizontal } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";
import { TaskCard } from "./TaskCard";
import { AddTaskForm } from "./AddTaskForm";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (title: string, columnId: ColumnId) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: ColumnId) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  return (
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
      <p className="px-3 py-2 text-xs text-gray-500">
        {column.description}
      </p>

      {/* Tasks List */}
      <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto scrollbar-thin max-h-[calc(100vh-280px)]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      {/* Add Task Form */}
      <div className="px-2 pb-3 mt-auto">
        <AddTaskForm columnId={column.id} onAdd={onAddTask} />
      </div>
    </div>
  );
}
