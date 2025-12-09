import { useState } from "react";
import type { Task, ColumnId, Column } from "@/types/kanban";
import { COLUMNS } from "@/types/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { Search, Filter, LayoutGrid } from "lucide-react";
import { initialTasks } from "../lib/mockData";
// Initial sample tasks


export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByColumn = (columnId: ColumnId) =>
    filteredTasks.filter((task) => task.columnId === columnId);

  const handleAddTask = (title: string, columnId: ColumnId) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      columnId,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === draggedTaskId ? { ...task, columnId } : task
        )
      );
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">Project Board</h1>
        </div>
        {/* <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by keyword or field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-72 h-9 text-sm bg-white border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-colors placeholder:text-gray-500"
            />
          </div>
          <button className="flex items-center gap-2 h-9 px-3 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div> */}
      </header>

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
