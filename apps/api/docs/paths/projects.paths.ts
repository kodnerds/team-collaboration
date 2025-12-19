/**
 * Project endpoints
 */

export const projectPaths = {
  '/projects': {
    post: {
      tags: ['Projects'],
      summary: 'Create a new project',
      description: 'Create a new project for the authenticated user',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateProjectRequest'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Project successfully created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectCreateResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        }
      }
    },
    get: {
      tags: ['Projects'],
      summary: 'Get all projects',
      description: 'Retrieve all projects with pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
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
          description: 'Projects retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectListResponse'
              }
            }
          }
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError'
        }
      }
    }
  },
  '/projects/{id}': {
    get: {
      tags: ['Projects'],
      summary: 'Get a single project',
      description: 'Retrieve a specific project by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        }
      ],
      responses: {
        '200': {
          description: 'Project retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectResponse'
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
    put: {
      tags: ['Projects'],
      summary: 'Update a project',
      description: 'Update an existing project',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
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
              $ref: '#/components/schemas/UpdateProjectRequest'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Project updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectResponse'
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
      tags: ['Projects'],
      summary: 'Delete a project',
      description: 'Delete an existing project',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Project ID'
        }
      ],
      responses: {
        '200': {
          description: 'Project deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Project deleted successfully'
                  }
                }
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
  }
};

