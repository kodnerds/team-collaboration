import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestUser } from '../utils/helper-function';

import type { UserEntity } from '../../src/entities';
import type { AuthenticatedUser } from '../../src/types';

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
    const validationCases = [
      {
        description: 'should return 400 when name is missing',
        payload: { description: 'This is a test project description' },
        expectedError: 'Name is required'
      },
      {
        description: 'should return 400 when name is empty string',
        payload: { name: '', description: 'This is a test project description' },
        expectedError: 'Name is required'
      },
      {
        description: 'should return 400 when name is not a string',
        payload: { name: 12_345, description: 'This is a test project description' },
        expectedError: 'Name must be a string'
      },
      {
        description: 'should return 400 when description is not a string',
        payload: { name: 'Test Project', description: 12_345 },
        expectedError: 'Description must be a string'
      }
    ];

    it.each(validationCases)('$description', async ({ payload, expectedError }) => {
      const response = await factory.app
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContain(expectedError);
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
});
