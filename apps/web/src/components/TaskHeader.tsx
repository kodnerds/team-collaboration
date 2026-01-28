import { X } from "lucide-react";
interface TaskHeaderProps {
  taskId: string;
  onClose?: () => void;
}

export function TaskHeader({ taskId, onClose }: TaskHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
     
        <div  className="h-8  text-gray-500 hover:text-gray-900">
          <span>Task #{taskId.slice(-4)}</span>
        </div>
      <div >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors"
          >
            <X className="w-4 h-4"/>
          </button>
        )}
       </div>

        
    </div>
  );
}