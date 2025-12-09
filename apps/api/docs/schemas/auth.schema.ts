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
    user: {
      $ref: '#/components/schemas/User'
    }
  }
};

