import { TestFactory } from '../factory';
import { createTestUser } from '../utils/helper-function';

import type { UserEntity } from '../../src/entities';
import type { PasswordResetEntity } from '../../src/entities/PasswordResetEntity';

describe('POST /auth/login', () => {
  const factory: TestFactory = new TestFactory();
  let testUser: UserEntity;

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
      email: 'john@gmail.com'
    });
  });

  it('should login successfully with correct credentials and return user data without sensitive fields', async () => {
    const response = await factory.app.post('/auth/login').send({
      email: 'john@gmail.com',
      password: 'Test123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id', testUser.id);
    expect(response.body.data).toHaveProperty('name', 'John Doe');
    expect(response.body.data).not.toHaveProperty('password');
    expect(response.body.data).not.toHaveProperty('email');
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should return 401 for non-existent email or incorrect password', async () => {
    const response1 = await factory.app.post('/auth/login').send({
      email: 'nonexistent@gmail.com',
      password: 'Test123'
    });

    expect(response1.status).toBe(401);
    expect(response1.body).toHaveProperty('message', 'User not found');
    expect(response1.body).not.toHaveProperty('accessToken');

    const response2 = await factory.app.post('/auth/login').send({
      email: 'john@gmail.com',
      password: 'WrongPassword123'
    });

    expect(response2.status).toBe(401);
    expect(response2.body).toHaveProperty('message', 'Invalid credentials');
    expect(response2.body).not.toHaveProperty('accessToken');
  });

  it('should return 400 for validation errors', async () => {
    const testCases = [
      { payload: { password: 'Test123' }, errorMsg: 'Email is required' },
      { payload: { email: 'john@gmail.com' }, errorMsg: 'Password is required' },
      { payload: {}, errorMessages: ['Email is required', 'Password is required'] },
      { payload: { email: '', password: 'Test123' }, errorMsg: 'Email is required' },
      { payload: { email: 'john@gmail.com', password: '' }, errorMsg: 'Password is required' },
      {
        payload: { email: 'invalid-email', password: 'Test123' },
        errorMsg: 'Please enter a valid email address'
      },
      {
        payload: { email: 'john@gmail.com', password: '12345' },
        errorMsg: 'Password must be at least 6 characters'
      }
    ];

    for (const testCase of testCases) {
      const response = await factory.app.post('/auth/login').send(testCase.payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('errors');

      if (testCase.errorMessages) {
        testCase.errorMessages.forEach((msg) => {
          expect(response.body.errors).toContain(msg);
        });
      } else {
        expect(response.body.errors).toContain(testCase.errorMsg);
      }
    }
  });

  it('should not expose sensitive information in response', async () => {
    const response = await factory.app.post('/auth/login').send({
      email: 'john@gmail.com',
      password: 'Test123'
    });

    expect(response.status).toBe(200);
    const responseString = JSON.stringify(response.body);
    expect(responseString).not.toContain('Test123');
    expect(response.body.data).not.toHaveProperty('password');
  });
});

describe('POST /auth/signup', () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  beforeEach(async () => {
    await factory.reset();
  });

  it('should create a new user successfully', async () => {
    const response = await factory.app.post('/auth/signup').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123456',
      avatarUrl: 'https://example.com/avatar.png'
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', 'John Doe');
    expect(response.body.data).not.toHaveProperty('password');
    expect(response.body.data).not.toHaveProperty('email');
  });

  it('should return 409 when email already exists', async () => {
    await createTestUser(factory, {
      name: 'Existing User',
      email: 'existing@gmail.com'
    });

    const response = await factory.app.post('/auth/signup').send({
      name: 'Another User',
      email: 'existing@gmail.com',
      password: '123456'
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'User with this email already exists');
  });

  it('should return 400 for validation errors', async () => {
    const testCases = [
      { payload: { email: 'john@gmail.com', password: '123456' }, errorMsg: 'Name is required' },
      { payload: { name: 'John Doe', password: '123456' }, errorMsg: 'Email is required' },
      { payload: { name: 'John Doe', email: 'john@gmail.com' }, errorMsg: 'Password is required' },
      {
        payload: { name: 'John Doe', email: 'invalid-email', password: '123456' },
        errorMsg: 'Please enter a valid email address'
      },
      {
        payload: { name: 'John Doe', email: 'john@gmail.com', password: '12345' },
        errorMsg: 'Password must be at least 6 characters'
      },
      {
        payload: {
          name: 'John Doe',
          email: 'john@gmail.com',
          password: '123456',
          avatarUrl: 'not-a-url'
        },
        errorMsg: 'Avatar URL must be a valid URL'
      }
    ];

    for (const testCase of testCases) {
      const response = await factory.app.post('/auth/signup').send(testCase.payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body.errors).toContain(testCase.errorMsg);
    }
  });

  it('should hash password and not expose sensitive information', async () => {
    const password = '123456';
    const response = await factory.app.post('/auth/signup').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      password,
      avatarUrl: 'https://example.com/avatar.png'
    });

    expect(response.status).toBe(201);

    const userRepository = factory._connection.getRepository('UserEntity');
    const user = await userRepository.findOne({ where: { email: 'john@gmail.com' } });

    expect(user?.password).not.toBe(password);
    expect(user?.password.length).toBeGreaterThan(password.length);

    const responseString = JSON.stringify(response.body);
    expect(responseString).not.toContain(password);
    expect(responseString).not.toContain('john@gmail.com');
  });
});

describe('POST /auth/forgot-password', () => {
  const factory: TestFactory = new TestFactory();
  let testUser: UserEntity;

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
      email: 'john@gmail.com'
    });
  });

  it('should return 200 and create a password reset record when email exists', async () => {
    const response = await factory.app.post('/auth/forgot-password').send({
      email: 'john@gmail.com'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'If an account with this email exists, a password reset link has been sent.'
    );

    const PasswordResetRepository = factory._connection.getRepository('PasswordReset');
    const resets = await PasswordResetRepository.find({ where: { email: 'john@gmail.com' } });

    expect(resets.length).toBeGreaterThan(0);

    const reset = resets[0];
    expect(reset).toBeDefined();
    if (!reset) throw new Error('Expected at least one password reset record');

    expect(reset).toHaveProperty('token');
    expect(reset.status).toBe('active');
    expect(new Date(reset.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('should return 200 and not create a password reset record when email does not exist', async () => {
    const response = await factory.app.post('/auth/forgot-password').send({
      email: 'nonexistent@gmail.com'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'If an account with this email exists, a password reset link has been sent.'
    );

    const passwordResetRepo = factory._connection.getRepository('PasswordReset');
    const resets = await passwordResetRepo.find({ where: { email: 'nonexistent@gmail.com' } });

    expect(resets.length).toBe(0);
  });
});
