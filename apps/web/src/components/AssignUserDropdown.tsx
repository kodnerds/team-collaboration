import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { User } from '@/types/kanban';
import { fetchProjectMembers } from '@/api/projects';

interface Props {
  taskId: string;
  assignedUser: User | null;
  onAssign: (taskId: string, user: User | null) => Promise<void>;
  onClose: () => void;
}

export const AssignUserDropdown = ({
  taskId,
  assignedUser,
  onAssign,
  onClose,
}: Props) => {
  const params = useParams();
  const projectId = params.id;

  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    fetchProjectMembers(projectId)
      .then(setMembers)
      .catch(() => setError('Failed to load members'));
  }, [projectId]);

  const handleAssign = useCallback(
    async (member: User | null) => {
      setIsLoading(true);
      setError('');

      try {
        await onAssign(taskId, member);
        onClose();
      } catch {
        setError('Assignment failed');
      } finally {
        setIsLoading(false);
      }
    },
    [onAssign, onClose, taskId]
  );

  return (
    <div className="absolute z-50 bg-white border rounded-md shadow-md w-52 mt-2">
      {error && <p className="text-xs text-red-500 p-2">{error}</p>}

      {members.map((member) => {
        const isAssigned = assignedUser?.id === member.id;

        return (
          <button
            key={member.id}
            disabled={isLoading || isAssigned}
            onClick={() => handleAssign(member)}
            className={`flex items-center gap-2 px-3 py-2 w-full text-left
              ${isAssigned ? 'bg-blue-50 cursor-not-allowed' : 'hover:bg-gray-100'}
            `}
          >
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-300 text-xs flex items-center justify-center">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="text-sm flex-1">{member.name}</span>

            {isAssigned && (
              <span className="text-[10px] text-blue-600 font-medium">
                Assigned
              </span>
            )}
          </button>
        );
      })}

      <button
        onClick={() => handleAssign(null)}
        disabled={isLoading || !assignedUser}
        className="w-full text-xs text-gray-500 p-2 hover:bg-gray-50 disabled:opacity-50"
      >
        Unassign
      </button>
    </div>
  );
};
