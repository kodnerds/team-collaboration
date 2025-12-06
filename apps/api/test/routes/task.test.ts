import { TaskStatus } from '../../src/entities';
import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestProject, createTestUser, createTestTask } from '../utils/helper-function';

import type { UserEntity } from '../../src/entities';
import type { AuthenticatedUser } from '../../src/types';

describe('Tasks', () => {
  const factory: TestFactory = new TestFactory();
  let testUser: UserEntity;
  let authToken: string;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  beforeEach(async () => {
    await factory.reset();
    testUser = await createTestUser(factory, {
      name: 'John Doe',
      email: 'john@example.com'
    });

    const authenticatedUser: AuthenticatedUser = {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email
    };
    authToken = genToken(authenticatedUser);

    const project = await createTestProject(factory, testUser, {
      name: 'Test Project',
      description: 'This is a test project description'
    });
    projectId = project.id;

    const task = await createTestTask(factory, {
      user: testUser,
      project,
      title: 'Test Task',
      description: 'This is a test task description',
      status: 'todo'
    });
    taskId = task.id;
  });

  describe('POST /projects/:projectId/tasks', () => {
    it('should create a task successfully', async () => {
      const response = await factory.app
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Design UI screens',
          description: 'Wireframe the dashboard',
          status: 'doing'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Task created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title', 'Design UI screens');
      expect(response.body.data).toHaveProperty('status', 'doing');
      expect(response.body.data.project).toHaveProperty('id', projectId);
      expect(response.body.data.createdBy).toHaveProperty('id', testUser.id);
    });

    it('should default status to todo if not provided', async () => {
      const response = await factory.app
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Design UI screens'
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('status', TaskStatus.TODO);
    });

    it('should return 400 when title is missing', async () => {
      const response = await factory.app
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Wireframe the dashboard',
          status: 'doing'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Title is required');
    });

    it('should return 400 when status is invalid', async () => {
      const response = await factory.app
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Design UI screens',
          status: 'invalid_status'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('Status must be one of');
    });

    it('should return 404 when project not found', async () => {
      const nonExistentProjectId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .post(`/projects/${nonExistentProjectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Design UI screens'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Project not found');
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await factory.app.post(`/projects/${projectId}/tasks`).send({
        title: 'Design UI screens'
      });
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /projects/:projectId/tasks/:taskId', () => {
    it('should update a task successfully', async () => {
      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          description: 'Updated description',
          status: 'doing'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task updated successfully');
      expect(response.body.data).toHaveProperty('title', 'Updated Task');
      expect(response.body.data).toHaveProperty('description', 'Updated description');
      expect(response.body.data).toHaveProperty('status', 'doing');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should return 404 when task not found', async () => {
      const nonExistentTaskId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${nonExistentTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 404 when task is not in the project', async () => {
      const otherProject = await createTestProject(factory, testUser, {
        name: 'Other Project'
      });

      const response = await factory.app
        .patch(`/projects/${otherProject.id}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found in this project');
    });

    it('should return 403 when user is not the project creator', async () => {
      const otherUser = await createTestUser(factory, {
        name: 'Jane Doe',
        email: 'jane@example.com'
      });
      const otherUserToken = genToken({
        id: otherUser.id,
        name: otherUser.name,
        email: otherUser.email
      });

      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({
          title: 'Updated Task'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'You are not authorized to update this task');
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await factory.app.patch(`/projects/${projectId}/tasks/${taskId}`).send({
        title: 'Updated Task'
      });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });

    it('should return 400 when status is invalid', async () => {
      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          status: 'invalid_status'
        });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('Status must be one of');
    });
  });
});
