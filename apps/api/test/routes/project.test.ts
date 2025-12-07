import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestProject, createTestUser } from '../utils/helper-function';

import type { UserEntity } from '../../src/entities';
import type { AuthenticatedUser } from '../../src/types';

describe('Projects', () => {
  const factory: TestFactory = new TestFactory();
  let testUser: UserEntity;
  let otherUser: UserEntity;
  let authToken: string;
  let otherAuthToken: string;
  let projectId: string;

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

    otherUser = await createTestUser(factory, {
      name: 'Jane Smith',
      email: 'jane@example.com'
    });

    const authenticatedUser: AuthenticatedUser = {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email
    };
    authToken = genToken(authenticatedUser);

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
  });

  describe('POST /projects', () => {
    it('should create a project successfully with full createdBy relation', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Project created successfully');
      expect(response.body.data).toHaveProperty('createdBy.id', testUser.id);
      expect(response.body.data).toHaveProperty('createdBy.name', testUser.name);
      expect(response.body.data).toHaveProperty('createdBy.email', testUser.email);

      const projectRepository = factory._connection.getRepository('ProjectEntity');
      const project = await projectRepository.findOne({
        where: { id: response.body.data.id },
        relations: ['createdBy']
      });

      expect(project?.createdBy.id).toBe(testUser.id);
    });

    it('should return 400 when name is missing or invalid', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'This is a test project description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Name is required');
    });

    it('should return 401 without authentication', async () => {
      const response = await factory.app.post('/projects').send({
        name: 'Test Project',
        description: 'This is a test project description'
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });

    it('should return 401 with invalid token', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', 'Bearer invalid.token.here')
        .send({
          name: 'Test Project',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is invalid');
    });
  });

  describe('GET /projects', () => {
    it('should retrieve projects with correct pagination', async () => {
      for (let i = 0; i < 15; i++) {
        await createTestProject(factory, testUser, {
          name: `Project ${i + 1}`,
          description: `Description ${i + 1}`
        });
      }

      const response = await factory.app
        .get('/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Projects retrieved successfully');
      expect(response.body.data.items).toHaveLength(10);
      expect(response.body.data.meta).toHaveProperty('page', 1);
      expect(response.body.data.meta).toHaveProperty('total', 16);
      expect(response.body.data.meta).toHaveProperty('totalPages', 2);
    });

    it('should handle pagination parameters correctly', async () => {
      for (let i = 0; i < 15; i++) {
        await createTestProject(factory, testUser, {
          name: `Project ${i + 1}`,
          description: `Description ${i + 1}`
        });
      }

      const response = await factory.app
        .get('/projects?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toHaveLength(6);
      expect(response.body.data.meta.page).toBe(2);
      expect(response.body.data.meta.limit).toBe(10);
    });

    it('should return projects without password in createdBy', async () => {
      const response = await factory.app
        .get('/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const project = response.body.data.items[0];
      expect(project.createdBy).not.toHaveProperty('password');
    });

    it('should return 401 without authentication', async () => {
      const response = await factory.app.get('/projects');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });
  });

  describe('PUT /projects/:id', () => {
    it('should update project successfully by creator', async () => {
      const response = await factory.app
        .put(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Project',
          description: 'This is an updated test project description'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Project updated successfully');
      expect(response.body.data).toHaveProperty('name', 'Updated Project');
    });

    it('should return 400 when validation fails', async () => {
      const response = await factory.app
        .put(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 12_345
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Description must be a string');
    });

    it('should return 404 when project does not exist', async () => {
      const response = await factory.app
        .put(`/projects/2f23cc49-2b8b-4537-9e43-c347f1d08a66`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Project ID does not exist');
    });

    it('should return 403 when user is not the project creator', async () => {
      const response = await factory.app
        .put(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .send({
          name: 'Updated Project',
          description: 'This is an updated test project description'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'User is not the project creator');
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should return 404 when project ID does not exist', async () => {
      const response = await factory.app
        .delete(`/projects/2f23cc49-2b8b-4537-9e43-c347f1d08a66`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Project ID does not exist');
    });

    it('should return 403 when user is not the project creator', async () => {
      const response = await factory.app
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherAuthToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'User is not the project creator');
    });

    it('should return 200 when project is deleted successfully by creator', async () => {
      const response = await factory.app
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Project deleted successfully');
    });
  });
});
