/**
 * Export all schemas
 */

import { AuthResponseSchema, LoginRequestSchema, SignupRequestSchema } from './auth.schema';
import { ErrorSchema, PaginationMetaSchema } from './common.schema';
import {
  CreateProjectRequestSchema,
  ProjectListResponseSchema,
  ProjectSchema,
  UpdateProjectRequestSchema
} from './project.schema';
import {
  CreateTaskRequestSchema,
  TaskListResponseSchema,
  TaskSchema,
  UpdateTaskRequestSchema
} from './task.schema';
import { UserSchema } from './user.schema';

export const schemas = {
  // Common
  PaginationMeta: PaginationMetaSchema,
  Error: ErrorSchema,

  // User
  User: UserSchema,

  // Auth
  SignupRequest: SignupRequestSchema,
  LoginRequest: LoginRequestSchema,
  AuthResponse: AuthResponseSchema,

  // Project
  Project: ProjectSchema,
  CreateProjectRequest: CreateProjectRequestSchema,
  UpdateProjectRequest: UpdateProjectRequestSchema,
  ProjectListResponse: ProjectListResponseSchema,

  // Task
  Task: TaskSchema,
  CreateTaskRequest: CreateTaskRequestSchema,
  UpdateTaskRequest: UpdateTaskRequestSchema,
  TaskListResponse: TaskListResponseSchema
};

