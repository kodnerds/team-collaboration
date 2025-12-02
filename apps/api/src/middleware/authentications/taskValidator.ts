import { body } from 'express-validator';

import { TaskStatus } from '../../entities';

export const taskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isString()
    .withMessage('Status must be a string')
    .isIn([
      TaskStatus.TODO,
      TaskStatus.DOING,
      TaskStatus.IN_REVIEW,
      TaskStatus.APPROVED,
      TaskStatus.DONE
    ])
    .withMessage('Status must be one of the following: todo, doing, in_review, approved, done')
];
