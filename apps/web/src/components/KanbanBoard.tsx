import { AlertCircle, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { Column, Task, TaskStatus, User } from '@/types/kanban';
import { COLUMNS } from '@/types/kanban';

import {
  assignUserToTask,
  createTask,
  deleteTask,
  fetchTasksByProject,
  updateTask,
} from '@/api/tasks';

import { KanbanColumn } from './KanbanColumn';

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
        const message =
          err instanceof Error ? err.message : 'Failed to load tasks';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getTasksByColumn = (columnId: TaskStatus) =>
    tasks.filter((task) => task.status === columnId);

  const handleAddTask = async (title: string, status: TaskStatus) => {
    if (!id) return;

    try {
      await createTask(id, title, status);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to add task';
      setError(message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (
    e: React.DragEvent,
    columnId: TaskStatus
  ) => {
    e.preventDefault();

    if (!draggedTaskId) return;

    try {
      await updateTask(draggedTaskId, { status: columnId });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggedTaskId
            ? { ...task, status: columnId }
            : task
        )
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to move task';
      setError(message);
    } finally {
      setDraggedTaskId(null);
    }
  };

  const handleAssignUser = async (
    taskId: string,
    user: User | null
  ) => {  
    try {
      const response = await assignUserToTask(
        taskId,
        user ? user.id : null
      );

      const updatedTask: Task = response.data;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to assign user';
      setError(message);
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
      <header className="flex items-center px-6 py-4 border-b">
        <LayoutGrid className="w-5 h-5 text-blue-600 mr-2" />
        <h1 className="text-lg font-semibold">Project Board</h1>
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
              onAddTask={(title) =>
                handleAddTask(title, column.id)
              }
              onDeleteTask={handleDeleteTask}
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
