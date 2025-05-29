import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { CreateFlatDto } from './dto/create-flat.dto';
import { Flat, FlatDocument } from './schemas/flat.schema';

@Injectable()
export class FlatService {
  constructor(@InjectModel(Flat.name) private flatModel: Model<FlatDocument>) {}

  async create(createFlatDto: CreateFlatDto): Promise<Flat> {
    const createdFlat = new this.flatModel({
      capacity: createFlatDto.capacity,
      description: createFlatDto.description,
      name: createFlatDto.name,
    });
    console.log('createdFlat: ', createdFlat);
    return createdFlat.save();
  }

  async findAll(): Promise<Flat[]> {
    return this.flatModel.find().exec();
  }

  async findOne(id: string): Promise<Flat> {
    const res = await this.flatModel.findById(id).exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
    return res;
  }

  async update(id: string, updateFlatDto: UpdateFlatDto): Promise<Flat> {
    const res = await this.flatModel
      .findByIdAndUpdate(id, updateFlatDto, { new: true })
      .exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
    return res;
  }

  async remove(id: string): Promise<Flat> {
    const res = await this.flatModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
    return res;
  }
}
