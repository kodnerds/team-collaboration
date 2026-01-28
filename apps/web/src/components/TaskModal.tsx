import { TaskHeader } from './TaskHeader';
import { TaskProperties } from './TaskProperties';
import { TaskDescription } from './TaskDescription';
import type { Task } from '@/types/kanban';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskModal({ open, onOpenChange, task }: TaskModalProps) {
  if (!open || !task) return null;

  const taskData = {
    id: task.id,
    title: task.title,
    status: task.status as any,
    assignees: (task.assignees || []).map((assignee) => ({
      ...assignee,
      initials: assignee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    })),
    description: task.description || 'No description provided',
    createdAt: new Date(task.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    createdBy: task.createdBy
      ? {
          ...task.createdBy,
          initials: task.createdBy.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase(),
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        }
      : null
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-[1100px] min-w-[40vw] h-[50vh] bg-white border border-gray-200 rounded-lg shadow-lg p-0 gap-0 overflow-hidden relative">
        <TaskHeader taskId={task.id} onClose={() => onOpenChange(false)} />
        <div className="flex h-full">
          <div className="flex-1 flex flex-col overflow-hidden px-8 py-6">
            {/* Task Title */}
            <h1 className="text-2xl font-semibold text-black mb-4 leading-tight">{task.title}</h1>

            {/* Properties Grid */}
            <TaskProperties
              status={taskData.status}
              assignees={taskData.assignees}
              createdAt={taskData.createdAt}
              createdBy={taskData.createdBy}
            />

            {/* Description */}
            <TaskDescription description={taskData.description} />
          </div>
        </div>
      </div>
    </div>
  );
}
