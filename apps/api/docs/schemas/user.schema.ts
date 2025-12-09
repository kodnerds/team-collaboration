/**
 * User-related schemas
 */

export const UserSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier'
    },
    name: {
      type: 'string',
      description: 'User full name'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address'
    },
    avatarUrl: {
      type: 'string',
      format: 'uri',
      description: 'URL to user avatar',
      nullable: true
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Account creation timestamp'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Last update timestamp'
    }
  }
};

