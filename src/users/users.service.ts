import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update.user.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const isUserExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isUserExist) {
      throw new BadRequestException('Email already registered');
    }

    const newUser = new this.userModel(createUserDto);
    await newUser.save();
    return newUser.toJSON();
  }

  async findAll(): Promise<UserModel[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => user.toJSON());
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toJSON();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserModel> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser.toJSON();
  }

  async delete(id: string): Promise<UserModel> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
