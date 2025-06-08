import { CreateFlatDto } from 'src/flats/dto/create-flat.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from '../src/types';
import { CreateBookingDto } from 'src/bookings/dto/create-booking.dto';
import mongoose from 'mongoose';

export const testCreateUserDto: CreateUserDto = {
  email: 'test@example.com',
  password: 'password12345678',
  role: Role.USER,
};

export const testCreateFlatDto: CreateFlatDto = {
  name: 'Test Flat',
  description: 'Test Description',
  capacity: 1,
  address: 'Test Address',
  photos: ['https://inversify.io/img/logo.svg'],
  price: 100000,
  residence: 'Test Residence',
  coordinates: { lat: 1, lng: 1 },
  tags: [{ name: 'Test Tag' }],
  floor: 1,
  totalFloors: 1,
  overview: 'Test Overview',
};

const nextYear = new Date().getFullYear() + 1;

export const testCreateBookingDto: CreateBookingDto = {
  startDate: `${nextYear}-06-05`,
  endDate: `${nextYear}-06-06`,
  price: 100000,
  userId: '6842949cbc2e4cd77c01272d',
  flatId: '6842949cbc2e4cd77c01271d',
};
