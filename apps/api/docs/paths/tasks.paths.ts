/**
 * Task endpoints
 */

export const taskPaths = {
  '/projects/{projectId}/tasks': {
    post: {
      tags: ['Tasks'],
      summary: 'Create a new task',
      description: 'Create a new task within a project',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateTaskRequest'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Task successfully created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskCreateResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    },
    get: {
      tags: ['Tasks'],
      summary: 'Get all tasks for a project',
      description: 'Retrieve all tasks within a specific project with pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        },
        {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            default: 1
          },
          description: 'Page number'
        },
        {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            default: 10
          },
          description: 'Number of items per page'
        }
      ],
      responses: {
        '200': {
          description: 'Tasks retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskListResponse'
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    }
  },
  '/projects/{projectId}/tasks/{taskId}': {
    get: {
      tags: ['Tasks'],
      summary: 'Get a single task',
      description: 'Retrieve a specific task by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        },
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Task ID'
        }
      ],
      responses: {
        '200': {
          description: 'Task retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskResponse'
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    },
    patch: {
      tags: ['Tasks'],
      summary: 'Update a task',
      description: 'Update an existing task',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        },
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Task ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateTaskRequest'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Task updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    },
    delete: {
      tags: ['Tasks'],
      summary: 'Delete a task',
      description: 'Delete a specific task within a project. Only the project creator can delete tasks.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        },
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Task ID'
        }
      ],
      responses: {
        '200': {
          description: 'Task deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Task deleted successfully'
                  }
                }
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '403': {
          description: 'Forbidden - User not authorized to delete this task',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'You are not authorized to delete this task'
                  }
                }
              }
            }
          }
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    }
  }
  ,
  '/projects/{projectId}/tasks/{taskId}/assign': {
    patch: {
      tags: ['Tasks'],
      summary: 'Assign user to a task',
      description: 'Assign one or multiple users to a task',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        },
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Task ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AssignUserRequest'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Users assigned successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Task'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        },
        '403': {
          description: 'Forbidden - User is not the project creator',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        '404': {
          $ref: '#/components/responses/NotFoundError'
        }
      }
    }
  }
};

