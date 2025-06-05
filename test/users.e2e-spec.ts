import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../src/users/schemas/user.schema';
import { UserEntity } from '../src/users/entities/user.entiity';
import { ListResponse, Role } from '../src/types';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
import { testCreateUserDto } from './test.data';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<UserModel>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<UserModel>>(
      getModelToken(UserModel.name),
    );
    await app.init();

    await userModel.deleteMany({});
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(testCreateUserDto)
      .expect(201);

    const createdUser = response.body as UserEntity;
    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('email', testCreateUserDto.email);
    expect(createdUser).not.toHaveProperty('password12345678');
  });

  it('/users (GET)', async () => {
    await request(app.getHttpServer()).post('/users').send(testCreateUserDto);

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    const result = response.body as ListResponse<UserEntity>;

    expect(Array.isArray(result.data)).toBe(true);

    expect(result.total).toBe(1);
    const user = result.data[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email', testCreateUserDto.email);
    expect(user).toHaveProperty('role', testCreateUserDto.role);
    expect(user).not.toHaveProperty('password');
  });

  it('/users (GET:id)', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send(testCreateUserDto);
    const createdUser = createUserResponse.body as UserEntity;

    const response = await request(app.getHttpServer()).get('/users');

    const result = response.body as ListResponse<UserEntity>;

    const users = result.data;

    if (users.length > 0) {
      const user = users[0];
      const getUserResponse = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      const result = getUserResponse.body as UserEntity;
      expect(result).toHaveProperty('id', createdUser.id);
      expect(result).toHaveProperty('email', createdUser.email);
      expect(result).not.toHaveProperty('password');
    }
  });

  it('/users (PUT)', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send(testCreateUserDto)
      .expect(201);

    const createdUser = createUserResponse.body as UserEntity;

    const updatedUserDto: UpdateUserDto = {
      email: 'test2@example.com',
      password: 'password123456789_updated',
      id: createdUser.id,
      role: Role.ADMIN,
    };
    const updateUserResponse = await request(app.getHttpServer())
      .put(`/users/${createdUser.id}`)
      .send(updatedUserDto)
      .expect(200);

    const updatedUser = updateUserResponse.body as UserEntity;
    expect(updatedUser).toHaveProperty('id');
    expect(updatedUser).toHaveProperty('email', updatedUserDto.email);
    expect(updatedUser).toHaveProperty('role', updatedUserDto.role);
    expect(updatedUser).not.toHaveProperty('password123456789_updated');
  });

  it('/users (DELETE:id)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(testCreateUserDto)
      .expect(201);

    const createdUser = response.body as UserEntity;

    await request(app.getHttpServer())
      .delete(`/users/${createdUser.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .expect(404);
  });
});
