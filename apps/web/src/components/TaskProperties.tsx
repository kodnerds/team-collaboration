import { CircleCheck, User, Calendar, UserPlus } from 'lucide-react';

import type { TaskStatus } from '@/types/kanban';

interface Assignee {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface TaskPropertiesProps {
  readonly status: TaskStatus;
  readonly assignees: Assignee[];
  readonly createdAt: string;
  readonly createdBy: Assignee | null;
}

const statusConfig = {
  backlog: {
    label: 'BACKLOG',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-400'
  },
  todo: {
    label: 'TO DO',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-400'
  },
  doing: {
    label: 'IN PROGRESS',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-400'
  },
  in_review: {
    label: 'REVIEW',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    dotColor: 'bg-purple-400'
  },
  approved: {
    label: 'APPROVED',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    dotColor: 'bg-indigo-400'
  },
  done: {
    label: 'DONE',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    dotColor: 'bg-green-400'
  }
};

export const TaskProperties = ({
  status,
  assignees,
  createdAt,
  createdBy
}: TaskPropertiesProps) => {
  const statusInfo = statusConfig[status];

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Status and Assignees Row */}
      <div className="flex !flex-col  md:!flex-row lg:!flex-row px-2 justify-between gap-4">
        {/* Created Date */}
        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CircleCheck className="w-4 h-4" />
            <span>Status</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Assignees */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Assignees</span>
          </div>
          <div className="flex items-center gap-2">
            {assignees.length > 0 ? (
              <div className="flex items-center gap-2">
                {assignees.slice(0, 3).map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: assignee.color }}
                      title={assignee.name}
                    >
                      {assignee.initials}
                    </div>
                    <span className="text-sm text-gray-700">{assignee.name}</span>
                  </div>
                ))}
                {assignees.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
                    +{assignees.length - 3}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-400">Unassigned</span>
            )}
          </div>
        </div>
      </div>

      {/* Created Date and Created By */}
      <div className="flex  !flex-col  md:!flex-row lg:!flex-row px-2 justify-between gap-4">
        {/* Created Date */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Created</span>
          </div>
          <span className="text-sm text-gray-700">{createdAt}</span>
        </div>

        {/* Created By */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserPlus className="w-4 h-4" />
            <span>Created By</span>
          </div>
          <div className="flex items-center gap-2">
            {createdBy ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm"
                  style={{ backgroundColor: createdBy.color }}
                  title={createdBy.name}
                >
                  {createdBy.initials}
                </div>
                <span className="text-sm text-gray-700">{createdBy.name}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Unknown</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
