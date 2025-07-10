import mockPrisma from './mocks/prisma';
import {registerUser,loginUser, getAllUsers} from '../src/services/authServices/authService';
import bcrypt from 'bcrypt';

//Mocks
jest.mock('../src/utils/config/database', () => mockPrisma);

//mock other library
jest.mock('bcrypt',() => ({
    hash:jest.fn(() => Promise.resolve('hashed_password')),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken',()=>  ({
    sign:jest.fn(() => 'fake_jwt_token')
}));

describe('Auth Service: registerUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if user already exist', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({email:'robson@gmail.com'});

          const result = await registerUser({
              name:"Harry Da Souza",
              email:"robson@gmail.com",
              password:'secretoo',
              role:'ADMIN'
          });
          expect(result.code).toBe(400);
          expect(result.message).toBe('User already exist');
    });

    it('should return 201 if user is created', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
          mockPrisma.user.create.mockResolvedValue({
            id: '1',
            name: 'Kayode',
            email: 'kayode@gmail.com',
            password: 'hashed_password',
            role: 'ADMIN'
        });

        const result = await registerUser({
          name: 'Kayode',
          email: 'kayode@gmail.com',
          password: 'secret',
          role: 'ADMIN'
        }
    );
      expect(result.code).toBe(201);
      expect(result.data?.user.email).toBe('kayode@gmail.com');
  });
});


describe('Auth Service - loginUser', () => {
  it('should return 403 if user not found', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const loginResponse = await loginUser('slaw@outlook.com', 'adrenaline');

      expect(loginResponse.code).toBe(403);
      expect(loginResponse.success).toBe(false);
      expect(loginResponse.message).toBe('No email found');
  });

  it('should return 401 if password is incorrect', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'slaw@outlook.com',
      password: 'hashed_password'
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const loginResult = await loginUser('slaw@outlook.com', 'wrongpassword');

      expect(loginResult.code).toBe(401);
      expect(loginResult.success).toBe(false);
      expect(loginResult.message).toBe('Invalid Credentials');
  });

  
  it('should return 200 and a token if login is successful', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'kayode@gmail.com',
      password: 'hashed_password'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const loginresult = await loginUser('kayode@gmail.com', 'correctpassword');

    expect(loginresult.code).toBe(200);
    expect(loginresult.success).toBe(true);
    expect(loginresult.data?.token).toBe('fake_jwt_token');
  });
});


describe('Auth Service - getAllUsers', () => {
  it('should return 404 if no users', async () => {
    (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([]);

    const allUserResult = await getAllUsers();

    expect(allUserResult.code).toBe(404);
    expect(allUserResult.success).toBe(false);
    expect(allUserResult.message).toBe('No user avaiable');
  });

  it('should return 200 and users if found', async () => {
    (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Kayode', email: 'kayode@gmail.com' }
    ]);

    const userResult = await getAllUsers();

    expect(userResult.code).toBe(200);
    expect(userResult.success).toBe(true);
    expect(userResult.data?.Users.length).toBeGreaterThan(0);
  });
});
