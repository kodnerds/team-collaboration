import { genToken } from '../../src/utils/tokenJWT';
import { TestFactory } from '../factory';
import { createTestProject, createTestUser } from '../utils/helper-function';

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

  describe('GET /projects', () => {
    it('should retrieve projects with correct pagination and relations', async () => {
      // Create 15 test projects
      for (let i = 0; i < 15; i++) {
        await createTestProject(factory, testUser, {
          name: `Project ${i + 1}`,
          description: `Description ${i + 1}`
        });
      }

      // Test page 1 (default)
      const response1 = await factory.app
        .get('/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response1.status).toBe(200);
      expect(response1.body.data.items).toHaveLength(10);
      expect(response1.body.data.meta).toMatchObject({
        page: 1,
        limit: 10,
        total: 15,
        totalPages: 2
      });

      // Verify createdBy relation excludes password
      expect(response1.body.data.items[0].createdBy).toEqual({
        id: testUser.id,
        name: testUser.name,
        email: testUser.email
      });

      const response2 = await factory.app
        .get('/projects?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response2.status).toBe(200);
      expect(response2.body.data.items).toHaveLength(5);
      expect(response2.body.data.meta.page).toBe(2);
    });

    it('should handle invalid pagination gracefully', async () => {
      const response = await factory.app
        .get('/projects?page=-1&limit=abc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.meta.page).toBeGreaterThanOrEqual(1);
      expect(response.body.data.meta.limit).toBeGreaterThan(0);
    });

    it('should return 401 without valid authentication', async () => {
      // No auth header
      let response = await factory.app.get('/projects');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User is not authorized or token is missing');

      // Invalid token
      response = await factory.app
        .get('/projects')
        .set('Authorization', 'Bearer invalid.token.here');
      expect(response.status).toBe(401);
    });

    it('should return 400 for validation errors', async () => {
      const testCases = [
        { data: { description: 'No name' }, expectedError: 'Name is required' },
        { data: { name: '', description: 'Empty name' }, expectedError: 'Name is required' },
        {
          data: { name: 12_345, description: 'Name not string' },
          expectedError: 'Name must be a string'
        },
        {
          data: { name: 'Test', description: 12_345 },
          expectedError: 'Description must be a string'
        }
      ];

      for (const testCase of testCases) {
        const response = await factory.app
          .post('/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send(testCase.data);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: 'error',
          message: 'Validation error'
        });
        expect(response.body.errors).toContain(testCase.expectedError);
      }
    });
  });
});
