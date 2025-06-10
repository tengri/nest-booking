import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { FlatModel, FlatDocument } from './schemas/flat.schema';

@Injectable()
export class FlatService {
  constructor(
    @InjectModel(FlatModel.name)
    private flatModel: Model<FlatDocument>,
  ) {}

  async findAll(): Promise<FlatModel[]> {
    const flats = await this.flatModel.find().exec();
    return flats.map((flat) => flat.toJSON());
  }

  async findOne(id: string): Promise<FlatModel> {
    const res = await this.flatModel.findById(id).exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
    return res.toJSON();
  }

  async create(createFlatDto: CreateFlatDto): Promise<FlatModel> {
    const newFlat = new this.flatModel(createFlatDto);
    await newFlat.save();
    return newFlat.toJSON();
  }

  async update(id: string, updateFlatDto: UpdateFlatDto): Promise<FlatModel> {
    const res = await this.flatModel
      .findByIdAndUpdate(id, updateFlatDto, { new: true })
      .exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
    return res.toJSON();
  }

  async delete(id: string): Promise<void> {
    const res = await this.flatModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
  }

  async addFile({
    flatId,
    url,
    width,
    height,
    type,
    originalName,
  }: {
    flatId: string;
    url: string;
    width: number;
    height: number;
    type: string;
    originalName: string;
  }): Promise<void> {
    const res = await this.flatModel
      .findByIdAndUpdate(
        flatId,
        {
          $push: {
            files: { url, type, fileName: originalName, width, height },
          },
        },
        { new: true },
      )
      .exec();
    if (!res) {
      throw new NotFoundException('flat not found');
    }
  }
}
