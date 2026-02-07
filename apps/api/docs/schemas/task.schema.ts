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
    createdBy: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'User unique identifier'
        },
        name: {
          type: 'string',
          description: 'User full name'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address'
        }
      },
      description: 'User who created the task'
    },
    assignees: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'User unique identifier'
          },
          name: {
            type: 'string',
            description: 'User full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          }
        }
      },
      description: 'Users assigned to this task (Many-to-Many relation)'
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
  },
  description: 'Task object for get/update operations (project relation not included)'
};

export const TaskCreateResponseDataSchema = {
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
    status: {
      type: 'string',
      enum: ['todo', 'doing', 'in_review', 'approved', 'done'],
      description: 'Task status',
      default: 'todo'
    },
    project: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Project unique identifier'
        },
        name: {
          type: 'string',
          description: 'Project name'
        }
      },
      description: 'Minimal project information'
    },
    createdBy: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'User unique identifier'
        },
        name: {
          type: 'string',
          description: 'User full name'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address'
        }
      },
      description: 'User who created the task'
    }
  },
  description: 'Task creation response (no description or timestamps, includes project info)'
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

export const TaskCreateResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Task created successfully'
    },
    data: {
      $ref: '#/components/schemas/TaskCreateResponseData'
    }
  }
};

export const TaskResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Task fetched successfully'
    },
    data: {
      $ref: '#/components/schemas/Task'
    }
  }
};

export const TaskListResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Tasks fetched successfully'
    },
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


export const AssignUsersToTaskRequestSchema = {
  type: 'object',
  required: ['userIds'],
  properties: {
    userIds: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid'
      },
      minItems: 1,
      description: 'Array of user IDs to assign to the task',
      example: ['user123', 'user456']
    }
  }
};

export const AssignUsersToTaskResponseDataSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Task unique identifier',
      example: 'task456'
    },
    title: {
      type: 'string',
      description: 'Task title',
      example: 'Design UI screens'
    },
    status: {
      type: 'string',
      enum: ['todo', 'doing', 'in_review', 'approved', 'done'],
      description: 'Task status',
      example: 'doing'
    },
    assignees: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'User unique identifier',
            example: 'user123'
          },
          name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john@gmail.com'
          }
        }
      },
      description: 'Users assigned to this task'
    }
  }
};

export const AssignUsersToTaskResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Users assigned to task successfully'
    },
    data: {
      $ref: '#/components/schemas/AssignUsersToTaskResponseData'
    }
  }
};

export const UnassignUsersFromTaskResponseDataSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Task unique identifier',
      example: 'task456'
    },
    title: {
      type: 'string',
      description: 'Task title',
      example: 'Design UI screens'
    },
    description: {
      type: 'string',
      description: 'Task description',
      example: 'Create wireframes and mockups for the new UI',
      nullable: true
    },
    status: {
      type: 'string',
      enum: ['todo', 'doing', 'in_review', 'approved', 'done'],
      description: 'Task status',
      example: 'todo'
    }
  }
};

export const UnassignUsersFromTaskResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'User unassigned from task successfully'
    },
    data: {
      $ref: '#/components/schemas/UnassignUsersFromTaskResponseData'
    }
  }
};
