import { useState } from "react";

import CreateTaskModal from "./CreateTask";

interface Task {
  id: string | number;
  name: string;
  description?: string;
  stage: string;
}

interface ColumnProps {
  stage: string;
  tasks: Task[];
  setTasks: (t: Task[]) => void;
  projectId: string | number;
}

const Column = ({ stage, tasks, setTasks, projectId }: ColumnProps) => {
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <div className="bg-gray-100 p-3 rounded-lg w-80">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold capitalize">
          {stage.replace("-", " ")}
        </h2>

        <button
          className="text-sm text-gray-600 hover:text-black"
          onClick={() => setIsOpen(true)}
        >
          + Add Task
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="bg-white p-3 rounded shadow text-sm">
            {t.name}
          </div>
        ))}
      </div>

      {isOpen && (
        <CreateTaskModal
          projectId={projectId}
          stage={stage}
          onClose={() => setIsOpen(false)}
          onTaskCreated={(task) => setTasks([...tasks, task])}
        />
      )}
    </div>
  );
};

export default Column;
