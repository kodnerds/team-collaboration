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
  body('userId')
    .notEmpty()
    .withMessage('Assignee ID is required')
    .isArray()
    .withMessage('Assignee ID must be an array')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new TypeError('Assignee ID must be an array');
      }
      return true;
    })
];
