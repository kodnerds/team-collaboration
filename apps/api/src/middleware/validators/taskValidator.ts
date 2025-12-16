import { body } from 'express-validator';

import { TaskStatus } from '../../entities';

export const taskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage('Status must be one of: ' + Object.values(TaskStatus).join(', '))
];

export const taskUpdateValidator = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage('Status must be one of: ' + Object.values(TaskStatus).join(', '))
];

export const assignUserToTaskValidator = [
  body('userIds')
    .notEmpty()
    .withMessage('User IDs are required')
    .isArray({ min: 1 })
    .withMessage('User IDs must be a non-empty array')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new TypeError('User IDs must be an array');
      }
      if (value.length === 0) {
        throw new Error('At least one user ID is required');
      }
      if (!value.every((id) => typeof id === 'string' && id.trim().length > 0)) {
        throw new Error('All user IDs must be non-empty strings');
      }
      return true;
    })
];
