import { MoreHorizontal, GripVertical, Trash2, UserPlus, NotebookPen } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { AssignUserDropdown } from './AssignUserDropdown';
import { EditTaskModal } from './EditTaskModal';
import { StatusIndicator } from './StatusIndicator';

import type { Task } from '@/types/kanban';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onAssignUser: (taskId: string, userId: string | null) => Promise<void>;
  onClick?: () => void;
}

export const TaskCard = ({
  task,
  onDelete,
  onDragStart,
  onAssignUser,
  onUpdate,
  onClick
}: TaskCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const assignRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (assignRef.current && !assignRef.current.contains(event.target as Node)) {
        setIsAssignDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          isDraggingRef.current = true;
          onDragStart(e, task.id);
        }}
        onMouseDown={() => {
          isDraggingRef.current = false;
        }}
        onClick={() => {
          if (!isDraggingRef.current) {
            onClick?.();
          }
        }}
        className="group bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:cursor-pointer"
      >
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusIndicator status={task.status} className="w-2.5 h-2.5 ring-0" />
              <span className="text-xs text-gray-500 font-medium">#{task.id.slice(-4)}</span>
            </div>

            <h4 className="text-sm font-medium text-gray-900 leading-snug">{task.title}</h4>

            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>

          <div className="relative flex flex-col items-center" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 py-0 flex items-center justify-center rounded "
            >
              <MoreHorizontal className="w-4 h-5 text-blue-800" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg py-1">
                <div className="relative" ref={assignRef}>
                  <button
                    onClick={() => {
                      setIsAssignDropdownOpen(!isAssignDropdownOpen);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assign
                  </button>

                  {isAssignDropdownOpen && (
                    <AssignUserDropdown
                      taskId={task.id}
                      assignedUserIds={task.assignees?.map((assignee) => assignee.id) ?? []}
                      onAssign={onAssignUser}
                      onClose={() => {
                        setIsAssignDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                    />
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <NotebookPen className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setIsMenuOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}

            {/* Assigned User Display */}
            {task.assignees?.[0]?.id && (
              <div className="flex items-center gap-2 mt-2">
                {task.assignees?.[0]?.avatarUrl ? (
                  <img
                    src={task.assignees[0].avatarUrl}
                    alt={task.assignees[0].name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                    {task.assignees[0].name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  );
};
