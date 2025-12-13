/**
 * OpenAPI components configuration
 * Includes security schemes, common responses, and tags
 */

import { schemas } from './schemas';

export const components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT token in the format: Bearer <token>'
    }
  },
  schemas,
  responses: {
    UnauthorizedError: {
      description: 'Authentication token is missing or invalid',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    NotFoundError: {
      description: 'The specified resource was not found',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    ValidationError: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  }
};

export const tags = [
  {
    name: 'Authentication',
    description: 'User authentication endpoints'
  },
  {
    name: 'Projects',
    description: 'Project management endpoints'
  },
  {
    name: 'Tasks',
    description: 'Task management endpoints'
  }
];

