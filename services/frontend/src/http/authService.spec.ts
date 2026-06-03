import { authService } from './authService';
import apiClient from './apiClient';

jest.mock('./apiClient', () => ({
  post: jest.fn(),
}));

const mockPost = apiClient.post as jest.Mock;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should send POST /auth/login with email and password only', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'adotante' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };
      mockPost.mockResolvedValueOnce(mockResponse);

      const credentials = { email: 'test@example.com', password: 'password123' };
      const result = await authService.login(credentials);

      expect(mockPost).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw when API returns an error', async () => {
      const error = new Error('Network error');
      mockPost.mockRejectedValueOnce(error);

      await expect(authService.login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('register', () => {
    it('should send POST /auth/register with name, email, password — no confirmPassword', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const payload = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      await authService.register(payload);

      expect(mockPost).toHaveBeenCalledWith('/auth/register', payload);
      const calledPayload = mockPost.mock.calls[0][1];
      expect(calledPayload).not.toHaveProperty('confirmPassword');
    });

    it('should resolve without returning data on success', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      const result = await authService.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result).toBeUndefined();
    });

    it('should throw when API returns an error', async () => {
      const error = new Error('Conflict');
      mockPost.mockRejectedValueOnce(error);

      await expect(
        authService.register({ name: 'John', email: 'existing@example.com', password: 'password123' }),
      ).rejects.toThrow('Conflict');
    });
  });
});
