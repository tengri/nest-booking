import { CreateFlatDto } from 'src/flats/dto/create-flat.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from '../src/types';

export const testCreateUserDto: CreateUserDto = {
  email: 'test@example.com',
  password: 'password12345678',
  role: Role.USER,
};

export const testCreateFlatDto: CreateFlatDto = {
  name: 'Test Flat',
  description: 'Test Description',
  capacity: 1,
};
