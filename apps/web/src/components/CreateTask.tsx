import { useState } from "react";

import { createTask } from "../utils/api";

// TEMPORARY UNTIL REAL AUTH FUNCTION IS READY
const isAuthenticated = () => !!localStorage.getItem("token");

interface Task {
  id: string | number;
  name: string;
  description?: string;
  stage: string;
}

interface Props {
  projectId: string | number;
  stage: string;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const CreateTaskModal = ({ projectId, stage, onClose, onTaskCreated }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 

  if (!isAuthenticated()) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-lg w-80 text-center">
          <p className="text-red-600 font-medium">You must be logged in.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Task name is required.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await createTask({
        name,
        description,
        stage,
        projectId,
      });

      onTaskCreated(res.data as Task);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMessage(error.response?.data?.message || "Failed to create task.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6 animate-[fadeIn_0.25s_ease]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create Task
        </h2>

        {errorMessage && (
          <p className="text-red-600 text-sm font-medium mb-3">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium
                       hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isLoading ? "Creating..." : "Add Task"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-gray-200 text-gray-700 font-medium
                       hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
