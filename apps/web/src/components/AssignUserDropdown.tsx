import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { ProjectMember } from '@/api/projects';

import { fetchProjectMembers } from '@/api/projects';

interface Props {
  taskId: string;
  assignedUserIds: string[];
  onAssign: (taskId: string, userId: string | null) => Promise<void>;
  onClose: () => void;
}

export const AssignUserDropdown = ({ taskId, assignedUserIds, onAssign, onClose }: Props) => {
  const { id: projectId } = useParams<{ id: string }>();

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    fetchProjectMembers()
      .then(setMembers)
      .catch(() => setError('Failed to load members'));
  }, [projectId]);

  const handleAssign = async (userId: string | null) => {
    setIsLoading(true);
    setError('');

    try {
      await onAssign(taskId, userId);
      onClose();
    } catch {
      setError('Assignment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-0 z-50 bg-white border rounded-md shadow-md w-56 mt-2">
      {error && <p className="text-xs text-red-500 p-2">{error}</p>}

      {members.map((m) => {
        const isAssigned = assignedUserIds.includes(m.id);

        return (
          <button
            key={m.id}
            disabled={isAssigned || isLoading}
            onClick={() => handleAssign(m.id)}
            className={`flex items-center gap-2 px-3 py-2 w-full text-left
              ${isAssigned ? 'bg-blue-50 cursor-not-allowed' : 'hover:bg-gray-100'}
            `}
          >
            {/* Avatar with fallback */}
            {m.avatarUrl ? (
              <img src={m.avatarUrl} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                {m.name.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="text-sm text-gray-600">{m.name}</span>

            {isAssigned && <span className="ml-auto text-xs text-blue-600">Assigned</span>}
          </button>
        );
      })}

      <button
        onClick={() => handleAssign(null)}
        disabled={isLoading}
        className="w-full text-xs text-gray-500 p-2 hover:bg-gray-50"
      >
        Unassign
      </button>
    </div>
  );
};
