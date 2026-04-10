import { apiRequest } from './client';
import { AuthResponse, Role } from '../types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
