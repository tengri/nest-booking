import { Test, TestingModule } from '@nestjs/testing';
import { BookingModel } from '../src/bookings/schemas/bookings.schema';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ListResponse } from '../src/types';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../src/users/schemas/user.schema';
import { UserEntity } from '../src/users/entities/user.entiity';

import { FlatModel } from '../src/flats/schemas/flat.schema';
import { FlatEntity } from 'src/flats/entities/flat.enitity';
import { BookingEntity } from 'src/bookings/entities/bookings.entitiy';
import {
  testCreateUserDto,
  testCreateFlatDto,
  testCreateBookingDto,
} from './test.data';
import { UpdateBookingDto } from 'src/bookings/dto/update-booking.dto';
import { ConfigService } from '@nestjs/config';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let bookingModel: Model<BookingModel>;
  let flatModel: Model<FlatModel>;
  let userModel: Model<UserModel>;
  let testUserEntity: UserEntity;
  let testFlatEntity: FlatEntity;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: {
              MONGO_URI: 'mongodb://localhost:27017/aigerus-test-bookings',
            },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    bookingModel = moduleFixture.get<Model<BookingModel>>(
      getModelToken(BookingModel.name),
    );
    flatModel = moduleFixture.get<Model<FlatModel>>(
      getModelToken(FlatModel.name),
    );
    userModel = moduleFixture.get<Model<UserModel>>(
      getModelToken(UserModel.name),
    );

    await app.init();

    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send(testCreateUserDto);

    testUserEntity = createUserResponse.body as UserEntity;

    const createFlatResponse = await request(app.getHttpServer())
      .post('/flats')
      .send(testCreateFlatDto);

    testFlatEntity = createFlatResponse.body as FlatEntity;
  });

  afterEach(async () => {
    await bookingModel.deleteMany({});
    await userModel.deleteMany({});
    await flatModel.deleteMany({});
    await app.close();
  });

  it('/bookings (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send(testCreateBookingDto)
      .expect(201);

    const createdBooking = response.body as BookingEntity;
    expect(createdBooking).toHaveProperty('id');
    expect(createdBooking).toHaveProperty(
      'userId',
      testCreateBookingDto.userId,
    );
    expect(createdBooking).toHaveProperty(
      'flatId',
      testCreateBookingDto.flatId,
    );
  });

  it('/bookings (GET)', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send(testCreateBookingDto);

    const response = await request(app.getHttpServer())
      .get('/bookings')
      .expect(200);

    const bookingsResponse = response.body as ListResponse<BookingEntity>;

    expect(Array.isArray(bookingsResponse.data)).toBe(true);
    expect(bookingsResponse.total).toBe(1);
    const booking: BookingEntity = bookingsResponse.data[0];
    expect(booking).toHaveProperty('id');
    expect(booking).toHaveProperty('userId', testCreateBookingDto.userId);
    expect(booking).toHaveProperty('flatId', testCreateBookingDto.flatId);
    expect(booking.startDate).toBe(
      new Date(testCreateBookingDto.startDate).toISOString(),
    );
    expect(booking.endDate).toBe(
      new Date(testCreateBookingDto.endDate).toISOString(),
    );
  });

  it('/bookings (GET:id)', async () => {
    const createBookingResponse = await request(app.getHttpServer())
      .post('/bookings')
      .send(testCreateBookingDto)
      .expect(201);

    const createdBooking = createBookingResponse.body as BookingEntity;

    const getBookingResponse = await request(app.getHttpServer())
      .get(`/bookings/${createdBooking.id}`)
      .expect(200);

    const bookingResponse = getBookingResponse.body as BookingEntity;

    expect(bookingResponse).toHaveProperty('id', createdBooking.id);
    expect(bookingResponse).toHaveProperty('userId', createdBooking.userId);
    expect(bookingResponse).toHaveProperty('flatId', bookingResponse.flatId);
    expect(bookingResponse.startDate).toBe(
      new Date(testCreateBookingDto.startDate).toISOString(),
    );
    expect(bookingResponse.endDate).toBe(
      new Date(testCreateBookingDto.endDate).toISOString(),
    );
  });

  it('/bookings (PUT)', async () => {
    const nextYear = new Date().getFullYear() + 1;

    const createBookingResponse = await request(app.getHttpServer())
      .post('/bookings')
      .send(testCreateBookingDto)
      .expect(201);

    const createdBooking = createBookingResponse.body as BookingEntity;

    const updateBookingDto: UpdateBookingDto = {
      id: createdBooking.id,
      startDate: `${nextYear}-06-07`,
      endDate: `${nextYear}-06-08`,
      userId: testUserEntity.id,
      flatId: testFlatEntity.id,
    };

    const response = await request(app.getHttpServer())
      .put(`/bookings/${createdBooking.id}`)
      .send(updateBookingDto)
      .expect(200);

    const updatedBooking = response.body as BookingEntity;
    expect(updatedBooking).toHaveProperty('id', createdBooking.id);
    expect(updatedBooking).toHaveProperty('userId', testUserEntity.id);
    expect(updatedBooking).toHaveProperty('flatId', testFlatEntity.id);
    expect(updatedBooking.startDate).toBe(
      new Date(updateBookingDto.startDate).toISOString(),
    );
    expect(updatedBooking.endDate).toBe(
      new Date(updateBookingDto.endDate).toISOString(),
    );
  });

  it('/bookings (DELETE:id)', async () => {
    const nextYear = new Date().getFullYear() + 1;

    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send(testCreateBookingDto)
      .expect(201);

    const createdBooking = response.body as BookingEntity;

    await request(app.getHttpServer())
      .delete(`/bookings/${createdBooking.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/bookings/${createdBooking.id}`)
      .expect(404);
  });
});
