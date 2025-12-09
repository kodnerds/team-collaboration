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
      $ref: '#/components/schemas/User'
    },
    tasks: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Task'
      }
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
  }
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

export const ProjectListResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Project'
      }
    },
    meta: {
      $ref: '#/components/schemas/PaginationMeta'
    }
  }
};

