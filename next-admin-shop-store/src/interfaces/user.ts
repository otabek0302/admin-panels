interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string | 'ADMIN' | 'USER' | 'MANAGER';
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserResponse {
  users: User[];
  total: number;
}

interface UserRequest {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string | 'ADMIN' | 'USER' | 'MANAGER';
}

type UserRole = 'ADMIN' | 'USER';

export type { User, UserResponse, UserRequest, UserRole };
