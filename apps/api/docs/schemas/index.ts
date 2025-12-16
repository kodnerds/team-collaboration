/**
 * Export all schemas
 */

import {
  AuthResponseSchema,
  LoginRequestSchema,
  SignupRequestSchema,
  SignupResponseSchema
} from './auth.schema';
import { ErrorSchema, PaginationMetaSchema, ValidationErrorSchema } from './common.schema';
import {
  CreateProjectRequestSchema,
  ProjectCreateResponseDataSchema,
  ProjectCreateResponseSchema,
  ProjectListItemSchema,
  ProjectListResponseSchema,
  ProjectResponseSchema,
  ProjectSchema,
  UpdateProjectRequestSchema
} from './project.schema';
import {
  AssignUsersToTaskRequestSchema,
  AssignUsersToTaskResponseDataSchema,
  AssignUsersToTaskResponseSchema,
  CreateTaskRequestSchema,
  TaskCreateResponseDataSchema,
  TaskCreateResponseSchema,
  TaskListResponseSchema,
  TaskResponseSchema,
  TaskSchema,
  UpdateTaskRequestSchema
} from './task.schema';
import { UserSchema, UserMinimalSchema } from './user.schema';

export const schemas = {
  // Common
  PaginationMeta: PaginationMetaSchema,
  Error: ErrorSchema,
  ValidationError: ValidationErrorSchema,

  // User
  User: UserSchema,
  UserMinimal: UserMinimalSchema,

  // Auth
  SignupRequest: SignupRequestSchema,
  LoginRequest: LoginRequestSchema,
  AuthResponse: AuthResponseSchema,
  SignupResponse: SignupResponseSchema,

  // Project
  Project: ProjectSchema,
  CreateProjectRequest: CreateProjectRequestSchema,
  UpdateProjectRequest: UpdateProjectRequestSchema,
  ProjectCreateResponseData: ProjectCreateResponseDataSchema,
  ProjectCreateResponse: ProjectCreateResponseSchema,
  ProjectResponse: ProjectResponseSchema,
  ProjectListItem: ProjectListItemSchema,
  ProjectListResponse: ProjectListResponseSchema,

  // Task
  Task: TaskSchema,
  CreateTaskRequest: CreateTaskRequestSchema,
  UpdateTaskRequest: UpdateTaskRequestSchema,
  TaskCreateResponseData: TaskCreateResponseDataSchema,
  TaskCreateResponse: TaskCreateResponseSchema,
  TaskResponse: TaskResponseSchema,
  TaskListResponse: TaskListResponseSchema,
  AssignUsersToTaskRequest: AssignUsersToTaskRequestSchema,
  AssignUsersToTaskResponseData: AssignUsersToTaskResponseDataSchema,
  AssignUsersToTaskResponse: AssignUsersToTaskResponseSchema
};

