import apiClient from '@/http/apiClient';
import { UserType } from '@/types/user';

export type LoginCredentialsType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  user: UserType;
  accessToken: string;
  refreshToken: string;
};

export type RegisterPayloadType = {
  name: string;
  email: string;
  password: string;
};

class AuthService {
  async login(credentials: LoginCredentialsType): Promise<LoginResponseType> {
    const response = await apiClient.post<LoginResponseType>('/auth/login', credentials);
    return response.data;
  }

  async register(payload: RegisterPayloadType): Promise<void> {
    await apiClient.post('/auth/register', payload);
  }
}

export const authService = new AuthService();
