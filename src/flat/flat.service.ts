import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { Flat, FlatDocument } from './schemas/flat.schema';

@Injectable()
export class FlatService {
  constructor(@InjectModel(Flat.name) private flatModel: Model<FlatDocument>) {}

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

  async create(createFlatDto: CreateFlatDto): Promise<Flat> {
    return this.flatModel.create(createFlatDto);
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

  async delete(id: string): Promise<Flat> {
    const res = await this.flatModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
    return res;
  }
}
