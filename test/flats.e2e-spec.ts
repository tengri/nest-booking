import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFlatDto } from '../src/flats/dto/update-flat.dto';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ListResponse } from 'src/types';
import { FlatModel } from '../src/flats/schemas/flat.schema';
import { FlatEntity } from 'src/flats/entities/flat.enitity';

import { testCreateFlatDto } from './test.data';

describe('FlatsController (e2e)', () => {
  let app: INestApplication;
  let flatModel: Model<FlatModel>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    flatModel = moduleFixture.get<Model<FlatModel>>(
      getModelToken(FlatModel.name),
    );
    await app.init();

    await flatModel.deleteMany({});
  });

  afterEach(async () => {
    await app.close();
  });

  it('/flats (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/flats')
      .send(testCreateFlatDto)
      .expect(201);

    const createdFlat = response.body as FlatEntity;
    expect(createdFlat).toHaveProperty('id');
    expect(createdFlat).toHaveProperty('name', testCreateFlatDto.name);
    expect(createdFlat).toHaveProperty(
      'description',
      testCreateFlatDto.description,
    );
    expect(createdFlat).toHaveProperty('capacity', testCreateFlatDto.capacity);
  });

  it('/flats (GET)', async () => {
    await request(app.getHttpServer()).post('/flats').send(testCreateFlatDto);

    const response = await request(app.getHttpServer())
      .get('/flats')
      .expect(200);
    const result = response.body as ListResponse<FlatEntity>;

    expect(Array.isArray(result.data)).toBe(true);

    expect(result.total).toBe(1);
    const flat = result.data[0];
    expect(flat).toHaveProperty('id');
    expect(flat).toHaveProperty('name', testCreateFlatDto.name);
    expect(flat).toHaveProperty('description', testCreateFlatDto.description);
    expect(flat).toHaveProperty('capacity', testCreateFlatDto.capacity);
  });

  it('/flats/:id (PUT)', async () => {
    const createdFlatResponse = await request(app.getHttpServer())
      .post('/flats')
      .send(testCreateFlatDto)
      .expect(201);

    const createdFlat = createdFlatResponse.body as FlatEntity;

    const updateFlatDto: UpdateFlatDto = {
      ...testCreateFlatDto,
      id: createdFlat.id,
      name: 'Updated Flat',
    };

    console.log('updateFlatDto: ', updateFlatDto);
    const updateResponse = await request(app.getHttpServer())
      .put(`/flats/${createdFlat.id}`)
      .send(updateFlatDto)
      .expect(200);

    const updatedFlat = updateResponse.body as FlatEntity;
    expect(updatedFlat).toHaveProperty('id', createdFlat.id);
    expect(updatedFlat).toHaveProperty('name', updateFlatDto.name);
    expect(updatedFlat).toHaveProperty(
      'description',
      updateFlatDto.description,
    );
    expect(updatedFlat).toHaveProperty('capacity', updateFlatDto.capacity);
  });

  it('/flats (DELETE:id)', async () => {
    const response = await request(app.getHttpServer())
      .post('/flats')
      .send(testCreateFlatDto)
      .expect(201);

    const createdFlat = response.body as FlatEntity;

    await request(app.getHttpServer())
      .delete(`/flats/${createdFlat.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/flats/${createdFlat.id}`)
      .expect(404);
  });
});
