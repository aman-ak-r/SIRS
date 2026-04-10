import { apiRequest } from './client';
import { User } from '../types';

export function getUsers(token: string) {
  return apiRequest<User[]>('/users', { token });
}
