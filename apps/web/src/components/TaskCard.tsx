import { MoreHorizontal, GripVertical, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { StatusIndicator } from './StatusIndicator';

import type { ProjectMember, Task } from '@/types/kanban';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onAssignUser: (taskId: string, user: ProjectMember | null) => Promise<void>;
}

export const TaskCard = ({
  task,
  onDelete,
  onDragStart,
  onAssignUser,
}: TaskCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusIndicator status={task.status} className="w-2.5 h-2.5" />
            <span className="text-xs text-gray-500 font-medium">
              #{task.id.slice(-4)}
            </span>
          </div>

          <h4 className="text-sm font-medium text-gray-900">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="h-6 w-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] bg-white border rounded-md shadow-lg py-1">
              <button
                onClick={() => {
                  onDelete(task.id);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                onClick={() => {
                  onAssignUser(task.id, null);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Unassign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
