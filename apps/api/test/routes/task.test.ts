import { TaskStatus } from '../../src/entities';
import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestProject, createTestUser, createTestTask } from '../utils/helper-function';

import type { UserEntity, ProjectEntity } from '../../src/entities';
import type { AuthenticatedUser } from '../../src/types';

describe('Tasks', () => {
  const factory: TestFactory = new TestFactory();
  let testUser: UserEntity;
  let authToken: string;
  let projectId: string;
  let taskId: string;
  let testProject: ProjectEntity;
  let otherAuthToken: string;

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

    const otherUser = await createTestUser(factory, {
      name: 'Other User',
      email: 'other@example.com'
    });
    const otherAuthenticatedUser: AuthenticatedUser = {
      id: otherUser.id,
      name: otherUser.name,
      email: otherUser.email
    };
    otherAuthToken = genToken(otherAuthenticatedUser);

    const project = await createTestProject(factory, testUser, {
      name: 'Test Project',
      description: 'This is a test project description'
    });
    projectId = project.id;
    testProject = project;

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

  describe('GET /projects/:projectId/tasks', () => {
    it('should return all tasks for a project', async () => {
      const response = await factory.app
        .get(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tasks fetched successfully');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('id', taskId);
      expect(response.body.data[0]).toHaveProperty('title', 'Test Task');
      expect(response.body.data[0]).toHaveProperty(
        'description',
        'This is a test task description'
      );
      expect(response.body.data[0]).toHaveProperty('status', 'todo');
      expect(response.body.data[0]).toHaveProperty('createdBy');
      expect(response.body.data[0].createdBy).toHaveProperty('id', testUser.id);
      expect(response.body.data[0].createdBy).toHaveProperty('name', testUser.name);
      expect(response.body.data[0].createdBy).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('limit', 10);
      expect(response.body.meta).toHaveProperty('total', 1);
    });

    it('should return multiple tasks with pagination', async () => {
      await createTestTask(factory, {
        user: testUser,
        project: testProject,
        title: 'Second Task',
        description: 'Description for second task',
        status: 'doing'
      });

      await createTestTask(factory, {
        user: testUser,
        project: testProject,
        title: 'Third Task',
        description: 'Description for third task',
        status: 'done'
      });

      const response = await factory.app
        .get(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.meta).toHaveProperty('total', 3);
    });

    it('should respect pagination parameters', async () => {
      await createTestTask(factory, {
        user: testUser,
        project: testProject,
        title: 'Second Task',
        status: 'doing'
      });

      const response = await factory.app
        .get(`/projects/${projectId}/tasks?page=1&limit=1`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('limit', 1);
      expect(response.body.meta).toHaveProperty('total', 2);
    });

    it('should return empty array when project has no tasks', async () => {
      const emptyProject = await createTestProject(factory, testUser, {
        name: 'Empty Project',
        description: 'Project with no tasks'
      });

      const response = await factory.app
        .get(`/projects/${emptyProject.id}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tasks fetched successfully');
      expect(response.body.data).toHaveLength(0);
      expect(response.body.meta).toHaveProperty('total', 0);
    });

    it('should return 404 when project not found', async () => {
      const nonExistentProjectId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .get(`/projects/${nonExistentProjectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Project not found');
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await factory.app.get(`/projects/${projectId}/tasks`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });
  });

  describe('GET /projects/:projectId/tasks/:taskId', () => {
    it('should return 200 when task is found', async () => {
      const response = await factory.app
        .get(`/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task fetched successfully');
      expect(response.body.data).toHaveProperty('id', taskId);
      expect(response.body.data).toHaveProperty('title', 'Test Task');
      expect(response.body.data).toHaveProperty('description', 'This is a test task description');
      expect(response.body.data).toHaveProperty('status', 'todo');
      expect(response.body.data).toHaveProperty('createdBy');
    });

    it('should return 404 when task is not found', async () => {
      const nonExistentTaskId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .get(`/projects/${projectId}/tasks/${nonExistentTaskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 404 when project is not found', async () => {
      const nonExistentProjectId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .get(`/projects/${nonExistentProjectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task does not belong to this project');
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await factory.app.get(`/projects/${projectId}/tasks/${taskId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });
  });

  describe('GET /projects/:projectId/tasks', () => {
    it('should return all tasks for a project', async () => {
      // Create additional tasks
      await createTestTask(factory, {
        user: testUser,
        project: testProject,
        title: 'Task 2',
        description: 'Second task',
        status: 'doing'
      });

      await createTestTask(factory, {
        user: testUser,
        project: testProject,
        title: 'Task 3',
        description: 'Third task',
        status: 'done'
      });

      const response = await factory.app
        .get(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tasks fetched successfully');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('limit', 10);
      expect(response.body.meta).toHaveProperty('total', 3);
    });

    it('should return tasks with correct structure', async () => {
      const response = await factory.app
        .get(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('status');
      expect(response.body.data[0]).toHaveProperty('createdBy');
      expect(response.body.data[0].createdBy).toHaveProperty('id');
      expect(response.body.data[0].createdBy).toHaveProperty('name');
      expect(response.body.data[0].createdBy).toHaveProperty('email');
      expect(response.body.data[0]).toHaveProperty('createdAt');
      expect(response.body.data[0]).toHaveProperty('updatedAt');
    });

    it('should support pagination with custom page and limit', async () => {
      // Create additional tasks
      for (let i = 2; i <= 15; i++) {
        await createTestTask(factory, {
          user: testUser,
          project: testProject,
          title: `Task ${i}`,
          status: 'todo'
        });
      }

      const response = await factory.app
        .get(`/projects/${projectId}/tasks?page=2&limit=5`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(5);
      expect(response.body.meta).toHaveProperty('page', 2);
      expect(response.body.meta).toHaveProperty('limit', 5);
      expect(response.body.meta).toHaveProperty('total', 15);
    });

    it('should return empty array when project has no tasks', async () => {
      const newProject = await createTestProject(factory, testUser, {
        name: 'Empty Project'
      });

      const response = await factory.app
        .get(`/projects/${newProject.id}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tasks fetched successfully');
      expect(response.body.data).toEqual([]);
      expect(response.body.meta).toHaveProperty('total', 0);
    });

    it('should return 404 when project does not exist', async () => {
      const nonExistentProjectId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .get(`/projects/${nonExistentProjectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Project not found');
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await factory.app.get(`/projects/${projectId}/tasks`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });
  });

  describe('PATCH /projects/:projectId/tasks/:taskId/assign', () => {
    it('should assign users to a task successfully', async () => {
      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: [testUser.id]
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Users assigned to task successfully');
      expect(response.body.data).toHaveProperty('id', taskId);
      expect(response.body.data.assignees).toHaveLength(1);
      expect(response.body.data.assignees[0]).toHaveProperty('id', testUser.id);
    });

    it('should return 404 when task not found', async () => {
      const nonExistentTaskId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${nonExistentTaskId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: [testUser.id]
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 404 when project not found', async () => {
      const nonExistentProjectId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .patch(`/projects/${nonExistentProjectId}/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: [testUser.id]
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task does not belong to this project');
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${taskId}/assign`)
        .send({
          userId: [testUser.id]
        });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });

    it('should return 403 when user is not authorized to assign users to task', async () => {
      const response = await factory.app
        .patch(`/projects/${projectId}/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .send({
          userId: [testUser.id]
        });
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        'message',
        'You are not authorized to assign user to this task'
      );
    });
  });

  describe('DELETE /projects/:projectId/tasks/:taskId', () => {
    it('should delete a task successfully', async () => {
      const response = await factory.app
        .delete(`/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task deleted successfully');

      const getResponse = await factory.app
        .get(`/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when task not found or does not belong to project', async () => {
      const nonExistentTaskId = '2f23cc49-2b8b-4537-9e43-c347f1d08a66';
      const response = await factory.app
        .delete(`/projects/${projectId}/tasks/${nonExistentTaskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
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
        .delete(`/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'You are not authorized to delete this task');
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await factory.app.delete(`/projects/${projectId}/tasks/${taskId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });
  });
});
