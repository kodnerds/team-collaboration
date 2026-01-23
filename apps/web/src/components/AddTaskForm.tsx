import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import type { TaskStatus } from '@/types/kanban';

interface AddTaskFormProps {
  columnId: TaskStatus;
  onAdd: (title: string, description: string, columnId: TaskStatus) => void;
}

export const AddTaskForm = ({ columnId, onAdd }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim(), columnId);
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add item
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title..."
          className="w-full mb-2 text-sm text-black bg-white border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-colors placeholder:text-gray-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description..."
          className="w-full mb-2 text-sm text-black bg-white border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-colors placeholder:text-gray-500"
        ></textarea>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="h-8 px-3 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
