import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestProject, createTestUser } from '../utils/helper-function';

import type { UserEntity } from '../../src/entities';
import type { AuthenticatedUser } from '../../src/types';

describe('POST /projects', () => {
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

    // Create a project for update tests
    const project = await createTestProject(factory, testUser, {
      name: 'Test Project',
      description: 'This is a test project description'
    });
    projectId = project.id;
  });

  describe('Successful project creation', () => {
    it('should create a project successfully by an authenticated user', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Project created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', 'Test Project');
      expect(response.body.data).toHaveProperty('createdBy');

      projectId = response.body.data.id;
    });

    it('should save project with a full createdBy relation (not just an ID)', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.createdBy).toHaveProperty('id', testUser.id);
      expect(response.body.data.createdBy).toHaveProperty('name', testUser.name);
      expect(response.body.data.createdBy).toHaveProperty('email', testUser.email);

      const projectRepository = factory._connection.getRepository('ProjectEntity');
      const project = await projectRepository.findOne({
        where: { id: response.body.data.id },
        relations: ['createdBy']
      });

      expect(project).toBeDefined();
      expect(project?.createdBy).toBeDefined();
      expect(project?.createdBy.id).toBe(testUser.id);
      expect(project?.createdBy.name).toBe(testUser.name);
      expect(project?.createdBy.email).toBe(testUser.email);
    });
  });

  describe('Get projects endpoint', () => {
    it('should verify correct pagination (15 projects, page 2, limit 10)', async () => {
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
      expect(response.body.data.meta.total).toBe(16);
      expect(response.body.data.meta.totalPages).toBe(2);
    });

    it('Should get 401 when trying to get project without authentication', async () => {
      const response = await factory.app.get('/projects');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });

    it('should retrieve projects successfully, and should verify correct pagination', async () => {
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
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body.data.meta).toHaveProperty('page');
      expect(response.body.data.meta).toHaveProperty('limit');
      expect(response.body.data.meta).toHaveProperty('total');
      expect(response.body.data.meta).toHaveProperty('totalPages');

      expect(response.body.data.items).toHaveLength(10);
      expect(response.body.data.meta.page).toBe(1);
    });

    it('should handle invalid pagination parameters gracefully', async () => {
      const response = await factory.app
        .get('/projects?page=-1&limit=abc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.meta.page).toBeGreaterThanOrEqual(1);
      expect(response.body.data.meta.limit).toBeGreaterThan(0);
    });

    it('should return projects with createdBy relation excluding password', async () => {
      await factory.app.post('/projects').set('Authorization', `Bearer ${authToken}`).send({
        name: 'Test Project for Relation',
        description: 'Description'
      });

      const response = await factory.app
        .get('/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const project = response.body.data.items[0];
      expect(project).toHaveProperty('createdBy');
      expect(project.createdBy).toHaveProperty('id', testUser.id);
      expect(project.createdBy).toHaveProperty('name', testUser.name);
      expect(project.createdBy).toHaveProperty('email', testUser.email);
      expect(project.createdBy).not.toHaveProperty('password');
    });
  });

  describe('Validation failures', () => {
    it('should return 400 when name is missing', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'This is a test project description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContain('Name is required');
    });

    it('should return 400 when name is empty string', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Name is required');
    });

    it('should return 400 when name is not a string', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 12_345,
          description: 'This is a test project description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Name must be a string');
    });

    it('should return 400 when description is not a string', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 12_345
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Description must be a string');
    });
  });

  describe('Unauthenticated access', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const response = await factory.app.post('/projects').send({
        name: 'Test Project',
        description: 'This is a test project description'
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });

    it('should return 401 when token is invalid', async () => {
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

  describe('Update project', () => {
    it('should return 400 when Validation failures', async () => {
      const response = await factory.app
        .put(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 12_345
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Description must be a string');
    });

    it('should return 404 when project ID does not exist', async () => {
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
          name: 'Test Project',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'User is not the project creator');
    });

    it('should return 200 when project is updated successfully by creator', async () => {
      const response = await factory.app
        .put(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'This is a updated test project description'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Project updated successfully');
    });
  });
});