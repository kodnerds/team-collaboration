/**
 * Authentication-related schemas
 */

export const SignupRequestSchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: {
      type: 'string',
      description: 'User full name',
      example: 'John Doe'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address',
      example: 'john.doe@example.com'
    },
    password: {
      type: 'string',
      format: 'password',
      minLength: 6,
      description: 'User password (min 6 characters)',
      example: 'SecurePass123'
    },
    avatarUrl: {
      type: 'string',
      format: 'uri',
      description: 'URL to user avatar',
      example: 'https://example.com/avatar.jpg'
    }
  }
};

export const LoginRequestSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address',
      example: 'john.doe@example.com'
    },
    password: {
      type: 'string',
      format: 'password',
      description: 'User password',
      example: 'SecurePass123'
    }
  }
};

export const AuthResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Login successful'
    },
    accessToken: {
      type: 'string',
      description: 'JWT access token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    data: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'User unique identifier'
        },
        name: {
          type: 'string',
          description: 'User full name',
          example: 'John Doe'
        }
      },
      description: 'User data without sensitive fields (email and password are excluded)'
    }
  }
};

export const SignupResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'User created successfully'
    },
    data: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'User unique identifier'
        },
        name: {
          type: 'string',
          description: 'User full name',
          example: 'John Doe'
        }
      },
      description: 'User data without sensitive fields (email and password are excluded)'
    }
  }
};

export const ListUsersResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Users fetched successfully'
    },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'User unique identifier',
            example: '123e4567-e89b-12d3-a456-426614174000'
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
            example: 'john@example.com'
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL to user avatar',
            nullable: true,
            example: 'https://example.com/avatar.jpg'
          }
        }
      },
      description: 'Array of user objects (password excluded for security)'
    }
  }
};

