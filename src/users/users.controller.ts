import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { ListResponse } from 'src/types';
import { UserEntity } from './entities/user.entiity';
import { UserModel } from './schemas/user.schema';

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<ListResponse<UserEntity>> {
    const users = await this.usersService.findAll();
    const res = {
      data: users.map((user) => new UserEntity(user)),
      total: users.length,
    };

    return res;
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<UserEntity> {
    const user: UserModel = await this.usersService.findOne(id);
    return new UserEntity(user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersService.create(createUserDto);
    return new UserEntity(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserEntity(user);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.usersService.delete(id);
  }
}
