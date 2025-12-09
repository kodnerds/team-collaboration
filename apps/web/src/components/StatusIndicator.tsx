import { cn } from "../lib/utils";
import type { ColumnId } from "@/types/kanban";

interface StatusIndicatorProps {
  status: ColumnId;
  className?: string;
}

const statusColors: Record<ColumnId, string> = {
  backlog: "bg-gray-400",
  todo: "bg-blue-400",
  inprogress: "bg-yellow-400",
  review: "bg-purple-400",
  done: "bg-green-400",
};

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block w-3 h-3 rounded-full ring-2 ring-white",
        statusColors[status],
        className
      )}
    />
  );
}
