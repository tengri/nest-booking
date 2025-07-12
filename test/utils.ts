import { Role } from '../src/types';

export const getNewUserRequest = () => {
  return {
    email: Math.random().toString(36).substring(2, 15) + '@example.com',
    password: 'password12345678',
    role: Role.USER,
  };
};
