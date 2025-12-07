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
