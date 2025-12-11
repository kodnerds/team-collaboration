// components/KanbanBoard.tsx
import { useState } from "react";
import type { Task, ColumnId, Column } from "@/types/kanban";
import { COLUMNS } from "@/types/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { LayoutGrid, AlertCircle } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

export function KanbanBoard() {
  // Use the custom hook instead of local state
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Function to get tasks by column 
  const getTasksByColumn = (columnId: ColumnId) =>
    tasks.filter((task) => task.columnId === columnId);

  // Function to add a task - now calls the API
  const handleAddTask = async (title: string, columnId: ColumnId) => {
    try {
      await createTask(title, columnId);
      // The hook automatically updates the tasks state
    } catch (err) {
      // Error handling is done in the hook
      console.error('Failed to add task:', err);
    }
  };

  // Function to delete a task - now calls the API
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      // The hook automatically updates the tasks state
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // This function runs when you START dragging a task
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  // This function runs when a dragged item is dragged OVER a drop zone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // This function runs when you DROP the dragged task - now calls the API
  const handleDrop = async (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    
    if (draggedTaskId) {
      try {
        // Update the task's column in the backend
        await updateTask(draggedTaskId, { columnId });
        // The hook automatically updates the tasks state
      } catch (err) {
        console.error('Failed to move task:', err);
      } finally {
        setDraggedTaskId(null);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">Project Board</h1>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full">
          {COLUMNS.map((column: Column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}