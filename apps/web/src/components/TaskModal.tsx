import { useMemo } from 'react';

import { TaskDescription } from './TaskDescription';
import { TaskHeader } from './TaskHeader';
import { TaskProperties } from './TaskProperties';

import type { Task } from '@/types/kanban';

interface TaskModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly task?: Task | null;
}

// Deterministic color generator based on string hash
const getColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.codePointAt(i);
    if (charCode !== undefined) {
      hash = charCode + ((hash << 5) - hash);
    }
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const TaskModal = ({ open, onOpenChange, task }: TaskModalProps) => {
  const taskData = useMemo(
    () => ({
      id: task?.id,
      title: task?.title,
      status: task?.status || 'backlog',
      assignees: (task?.assignees || []).map((assignee) => ({
        ...assignee,
        initials: assignee.name
          .split(' ')
          .map((n) => {
            const codePoint = n.codePointAt(0);
            return codePoint ? String.fromCodePoint(codePoint) : '';
          })
          .join('')
          .toUpperCase(),
        color: getColorFromString(assignee.name)
      })),
      description: task?.description || 'No description provided',
      createdAt: task?.createdAt
        ? new Date(task.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : '',
      createdBy: task?.createdBy
        ? {
            ...task.createdBy,
            initials: task.createdBy.name
              .split(' ')
              .map((n) => {
                const codePoint = n.codePointAt(0);
                return codePoint ? String.fromCodePoint(codePoint) : '';
              })
              .join('')
              .toUpperCase(),
            color: getColorFromString(task.createdBy.name)
          }
        : null
    }),
    [task]
  );

  if (!open || !task) return null;

  return (
    <div
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="max-w-4xl max-h-[70vh] md:max-h-[50vh] h-[70vh] md:!h-[50vh] w-[80vw] md:w-[40vw] bg-white border border-gray-200 rounded-lg shadow-lg p-0 gap-0 overflow-x-hidden overflow-y-auto relative">
        <TaskHeader taskId={task.id} onClose={() => onOpenChange(false)} />
        <div className="flex">
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
};
