import { cn } from '../lib/utils';

import type { TaskStatus } from '@/types/kanban';

interface StatusIndicatorProps {
  status: TaskStatus;
  className?: string;
}

const statusColors: Record<TaskStatus, string> = {
  backlog: 'bg-gray-400',
  todo: 'bg-blue-400',
  doing: 'bg-yellow-400',
  in_review: 'bg-purple-400',
  approved: 'bg-indigo-400',
  done: 'bg-green-400'
};

export const StatusIndicator = ({ status, className }: StatusIndicatorProps) => (
  <span
    className={cn(
      'inline-block w-3 h-3 rounded-full ring-2 ring-white',
      statusColors[status],
      className
    )}
  />
);
