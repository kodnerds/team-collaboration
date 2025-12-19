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
    }
  }
};

export const ValidationErrorSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['error'],
      description: 'Error status indicator',
      example: 'error'
    },
    message: {
      type: 'string',
      description: 'Error message',
      example: 'Validation error'
    },
    errors: {
      type: 'array',
      items: {
        type: 'string'
      },
      description: 'Array of validation error messages',
      example: ['Email is required', 'Password must be at least 6 characters']
    }
  }
};

