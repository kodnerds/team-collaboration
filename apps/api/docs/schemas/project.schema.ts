/**
 * Project-related schemas
 */

export const ProjectSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier'
    },
    name: {
      type: 'string',
      description: 'Project name'
    },
    description: {
      type: 'string',
      description: 'Project description',
      nullable: true
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
      description: 'User who created the project (only id, name, email returned)'
    }
  },
  description: 'Project object (timestamps and tasks array not included in responses)'
};

export const ProjectCreateResponseDataSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier'
    },
    name: {
      type: 'string',
      description: 'Project name'
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
      }
    }
  },
  description: 'Project creation response (description not included)'
};

export const CreateProjectRequestSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      description: 'Project name',
      example: 'Website Redesign'
    },
    description: {
      type: 'string',
      description: 'Project description',
      example: 'Redesigning company website with modern UI'
    }
  }
};

export const UpdateProjectRequestSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Project name',
      example: 'Website Redesign V2'
    },
    description: {
      type: 'string',
      description: 'Project description',
      example: 'Updated project description'
    }
  }
};

export const ProjectCreateResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Project created successfully'
    },
    data: {
      $ref: '#/components/schemas/ProjectCreateResponseData'
    }
  }
};

export const ProjectResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Project retrieved successfully'
    },
    data: {
      $ref: '#/components/schemas/Project'
    }
  }
};

export const ProjectListItemSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier'
    },
    name: {
      type: 'string',
      description: 'Project name'
    },
    description: {
      type: 'string',
      description: 'Project description',
      nullable: true
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
      description: 'User who created the project'
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Project creation timestamp'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Last update timestamp'
    }
  },
  description: 'Project object in list response (includes timestamps, excludes tasks array)'
};

export const ProjectListResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Projects retrieved successfully'
    },
    data: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/ProjectListItem'
          }
        },
        meta: {
          $ref: '#/components/schemas/PaginationMeta'
        }
      }
    }
  }
};

