/**
 * Task-related schemas
 */

export const TaskSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier'
    },
    title: {
      type: 'string',
      description: 'Task title'
    },
    description: {
      type: 'string',
      description: 'Task description',
      nullable: true
    },
    status: {
      type: 'string',
      enum: ['todo', 'doing', 'in_review', 'approved', 'done'],
      description: 'Task status',
      default: 'todo'
    },
    project: {
      $ref: '#/components/schemas/Project'
    },
    createdBy: {
      $ref: '#/components/schemas/User'
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Task creation timestamp'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Last update timestamp'
    }
  }
};

export const CreateTaskRequestSchema = {
  type: 'object',
  required: ['title'],
  properties: {
    title: {
      type: 'string',
      description: 'Task title',
      example: 'Design homepage mockup'
    },
    description: {
      type: 'string',
      description: 'Task description',
      example: 'Create high-fidelity mockup for the new homepage'
    },
    status: {
      type: 'string',
      enum: ['todo', 'doing', 'in_review', 'approved', 'done'],
      description: 'Task status',
      default: 'todo',
      example: 'todo'
    }
  }
};

export const UpdateTaskRequestSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Task title',
      example: 'Updated task title'
    },
    description: {
      type: 'string',
      description: 'Task description',
      example: 'Updated task description'
    },
    status: {
      type: 'string',
      enum: ['todo', 'doing', 'in_review', 'approved', 'done'],
      description: 'Task status',
      example: 'doing'
    }
  }
};

export const TaskListResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Task'
      }
    },
    meta: {
      $ref: '#/components/schemas/PaginationMeta'
    }
  }
};

