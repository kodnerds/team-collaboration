import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestUser } from '../utils/helper-function';

import type { UserEntity } from '../../src/entities';
import type { AuthenticatedUser } from '../../src/types/authenticateUser';

describe('POST /projects', () => {
  const factory: TestFactory = new TestFactory();
  let testUser: UserEntity;
  let authToken: string;

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

    it('should return 400 when name is too short', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'ab',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Name must be at least 3 characters long');
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

    it('should return 400 for multiple validation errors', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 12_345,
          description: 12_345
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain('Name must be a string');
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

    it('should return 401 when authorization header is malformed', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', 'InvalidToken')
        .send({
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

    it('should return 401 when Bearer prefix is missing', async () => {
      const response = await factory.app.post('/projects').set('Authorization', authToken).send({
        name: 'Test Project',
        description: 'This is a test project description'
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'User is not authorized or token is missing');
    });
  });

  describe('Edge cases', () => {
    it('should return 404 when authenticated user no longer exists in database', async () => {
      const userRepository = factory._connection.getRepository('UserEntity');
      await userRepository.delete({ id: testUser.id });

      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'This is a test project description'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should allow creating project with minimal valid data', async () => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Min',
          description: ''
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Project created successfully');
      expect(response.body.data).toHaveProperty('name', 'Min');
    });
  });
});
