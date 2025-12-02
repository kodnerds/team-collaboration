import { TaskStatus } from '../../src/entities';
import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestProject, createTestUser } from '../utils/helper-function';

import type { UserEntity, ProjectEntity } from '../../src/entities';
import type { AuthenticatedUser } from '../../src/types';

describe('POST /projects/:projectId/tasks', () => {
  const factory: TestFactory = new TestFactory();
  let testUser: UserEntity;
  let authToken: string;
  let testProject: ProjectEntity;

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

    testProject = await createTestProject(factory, testUser, {
      name: 'Test Project',
      description: 'Test Description'
    });
  });

  describe('POST /projects/:projectId/tasks', () => {
    it('should create a task successfully', async () => {
      const taskCreator = await createTestUser(factory, {
        name: 'Jane Doe',
        email: 'jane@example.com'
      });
      const taskCreatorToken = genToken({
        id: taskCreator.id,
        name: taskCreator.name,
        email: taskCreator.email
      });

      const response = await factory.app
        .post(`/projects/${testProject.id}/tasks`)
        .set('Authorization', `Bearer ${taskCreatorToken}`)
        .send({
          title: 'New Task',
          description: 'Task Description',
          status: TaskStatus.TODO
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Task created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title', 'New Task');
      expect(response.body.data).toHaveProperty('status', TaskStatus.TODO);
      expect(response.body.data.project).toHaveProperty('id', testProject.id);

      expect(response.body.data.createdBy).toHaveProperty('id', taskCreator.id);
      expect(response.body.data.createdBy).toHaveProperty('email', taskCreator.email);
    });

    it('should return 400 for validation errors', async () => {
      const response = await factory.app
        .post(`/projects/${testProject.id}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'No Title',
          status: TaskStatus.TODO
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });

    it('should return 404 if project does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await factory.app
        .post(`/projects/${nonExistentId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task',
          status: TaskStatus.TODO
        });

      expect(response.status).toBe(404);
    });

    it('should return 401 without valid authentication', async () => {
      const response = await factory.app.post(`/projects/${testProject.id}/tasks`).send({
        title: 'New Task',
        description: 'Task Description',
        status: TaskStatus.TODO
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User is not authorized or token is missing');
    });
  });
});
