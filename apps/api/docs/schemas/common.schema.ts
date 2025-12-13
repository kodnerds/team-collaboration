/**
 * Common schemas used across the API
 */

export const PaginationMetaSchema = {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      description: 'Current page number',
      example: 1
    },
    limit: {
      type: 'integer',
      description: 'Items per page',
      example: 10
    },
    total: {
      type: 'integer',
      description: 'Total number of items',
      example: 50
    },
    totalPages: {
      type: 'integer',
      description: 'Total number of pages',
      example: 5
    }
  }
};

export const ErrorSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      description: 'Error message',
      example: 'An error occurred'
    },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            example: 'email'
          },
          message: {
            type: 'string',
            example: 'Invalid email format'
          }
        }
      }
    }
  }
};

