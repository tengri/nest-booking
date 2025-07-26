import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { FlatModel, FlatDocument } from './schemas/flat.schema';
import { S3Service } from '../files/s3.service';

@Injectable()
export class FlatService {
  constructor(
    @InjectModel(FlatModel.name)
    private flatModel: Model<FlatDocument>,
    private s3Service: S3Service,
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

  async delete(id: string): Promise<string> {
    const flat = await this.flatModel.findById(id).exec();
    if (!flat) {
      throw new NotFoundException('flat not found');
    }

    // Delete all files from S3 before deleting the flat
    if (flat.files && flat.files.length > 0) {
      for (const file of flat.files) {
        try {
          await this.s3Service.deleteFile(file.url);
        } catch (error) {
          console.error(`Failed to delete file ${file.url} from S3:`, error);
        }
      }
    }

    await this.flatModel.findByIdAndDelete(id).exec();
    return id;
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
