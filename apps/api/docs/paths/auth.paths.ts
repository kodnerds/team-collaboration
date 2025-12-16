/**
 * Authentication endpoints
 */

export const authPaths = {
  '/auth/signup': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description: 'Create a new user account',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SignupRequest'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'User successfully created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignupResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '409': {
          description: 'User already exists',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login user',
      description: 'Authenticate user and receive access token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              }
            }
          }
        },
        '400': {
          $ref: '#/components/responses/ValidationError'
        },
        '401': {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  }
};

