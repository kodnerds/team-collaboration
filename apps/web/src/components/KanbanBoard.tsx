import { AlertCircle, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { KanbanColumn } from './KanbanColumn';

import type { Column, Task, TaskStatus } from '@/types/kanban';

import {
  assignUserToTask,
  createTask,
  deleteTask,
  fetchTasksByProject,
  updateTask
} from '@/api/tasks';
import { COLUMNS } from '@/types/kanban';

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

const handleDragStart = (e: React.DragEvent, taskId: string) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('taskId', taskId);
};

export const KanbanBoard = () => {
  const { id } = useParams<{ id: string }>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchTasksByProject(id);
        setTasks(response.data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load tasks';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getTasksByColumn = (columnId: TaskStatus) =>
    tasks.filter((task) => task.status === columnId);

  const handleAddTask = async (title: string, description: string, status: TaskStatus) => {
    if (!id) return;

    try {
      await createTask(id, title, description, status);
      const response = await fetchTasksByProject(id);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!id) return;

    try {
      await deleteTask(id, taskId);
      const response = await fetchTasksByProject(id);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to delete task');
    }
  };

  const handleDrop = async (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();

    const draggedTaskId = e.dataTransfer.getData('taskId');

    if (draggedTaskId && id) {
      try {
        await updateTask(id, draggedTaskId, { status: columnId });
        const response = await fetchTasksByProject(id);
        setTasks(response.data);
        setError(null);
      } catch (err) {
        const error = err as { message?: string };
        setError(error.message || 'Failed to move task');
      }
    }
  };

  const handleAssignUser = async (taskId: string, userId: string | null) => {
    if (!id) return;

    try {
      await assignUserToTask(id, taskId, userId);
      const response = await fetchTasksByProject(id);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to assign user');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!id) return;

    try {
      await updateTask(id, taskId, updates);
      const response = await fetchTasksByProject(id);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to update task');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">Project Board</h1>
        </div>
      </header>

      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border rounded flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full">
          {COLUMNS.map((column: Column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              onAddTask={(title, description) => handleAddTask(title, description, column.id)}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              onAssignUser={handleAssignUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
