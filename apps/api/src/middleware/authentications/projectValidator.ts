import { body } from 'express-validator';

export const projectValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('description').optional().isString().withMessage('Description must be a string')
];
