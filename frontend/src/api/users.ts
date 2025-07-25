import api from './axios';

export interface User {
  id: number;
  email: string;
  name?: string | null;
  createdAt: string;
  role: string;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/users/me');
  return res.data;
}