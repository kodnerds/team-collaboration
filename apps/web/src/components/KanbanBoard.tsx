import { LayoutGrid, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { KanbanColumn } from './KanbanColumn';

import type { TaskStatus, Column, Task } from '@/types/kanban';

import { fetchTasksByProject, createTask, updateTask, deleteTask } from '@/api/tasks';
import { COLUMNS } from '@/types/kanban';

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

export const KanbanBoard = () => {
  const { id } = useParams<{ id: string }>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchTasksByProject(id);
        setTasks(response.data);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || 'Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getTasksByColumn = (columnId: TaskStatus) =>
    tasks?.filter((task) => task.status === columnId);

  const handleAddTask = async (title: string, status: TaskStatus) => {
    if (!id) return;

    try {
      await createTask(id, title, status);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to delete task');
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();

    if (draggedTaskId) {
      try {
        await updateTask(draggedTaskId, { status: columnId });
        setTasks((prev) =>
          prev.map((task) => (task.id === draggedTaskId ? { ...task, status: columnId } : task))
        );
      } catch (err) {
        const error = err as { message?: string };
        setError(error.message || 'Failed to move task');
      } finally {
        setDraggedTaskId(null);
      }
    }
  };

  if (isLoading) {
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
              onAddTask={(title) => handleAddTask(title, column.id)}
              onDeleteTask={handleDeleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
