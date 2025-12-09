import type { Task } from "@/types/kanban";

export const initialTasks: Task[] = [
    {
      id: "task-001",
      title: "Set up project repository",
      description: "Initialize Git repo and configure CI/CD pipeline",
      columnId: "done",
      createdAt: new Date(),
    },
    {
      id: "task-002",
      title: "Design system documentation",
      description: "Create comprehensive design system docs",
      columnId: "review",
      createdAt: new Date(),
    },
    {
      id: "task-003",
      title: "Implement authentication flow",
      description: "Add login, signup, and password reset",
      columnId: "inprogress",
      createdAt: new Date(),
    },
    {
      id: "task-004",
      title: "API integration for dashboard",
      columnId: "todo",
      createdAt: new Date(),
    },
    {
      id: "task-005",
      title: "User feedback collection system",
      description: "Build feedback widget and analytics",
      columnId: "backlog",
      createdAt: new Date(),
    },
    {
      id: "task-006",
      title: "Performance optimization",
      columnId: "backlog",
      createdAt: new Date(),
    },
  ];

 