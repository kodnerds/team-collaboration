import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { ProjectMember } from '@/api/projects';

import { fetchProjectMembers } from '@/api/projects';

interface Props {
  taskId: string;
  onAssign: (taskId: string, user: ProjectMember | null) => Promise<void>;
  onClose: () => void;
}

export const AssignUserDropdown = ({ taskId, onAssign, onClose }: Props) => {
  const { id: projectId } = useParams<{ id: string }>();

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    fetchProjectMembers(projectId)
      .then(setMembers)
      .catch(() => setError('Failed to load members'));
  }, [projectId]);

  const handleAssign = async (member: ProjectMember | null) => {
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
  };

  return (
    <div className="absolute z-50 bg-white border rounded-md shadow-md w-48 mt-2">
      {error && <p className="text-xs text-red-500 p-2">{error}</p>}

      {members.map((m) => (
        <button
          key={m.id}
          disabled={isLoading}
          onClick={() => handleAssign(m)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
        >
          {m.avatarUrl && <img src={m.avatarUrl} alt={m.name} className="w-5 h-5 rounded-full" />}
          <span className="text-sm">{m.name}</span>
        </button>
      ))}

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
