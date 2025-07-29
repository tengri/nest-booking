import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FlatService } from './flats.service';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { ListResponse } from 'src/types';
import { FlatEntity } from './entities/flat.enitity';

@UsePipes(new ValidationPipe())
@Controller('flats')
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Get()
  async findAll(): Promise<ListResponse<FlatEntity>> {
    const flats = await this.flatService.findAll();
    return {
      data: flats.map((flat) => new FlatEntity(flat)),
      total: flats.length,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FlatEntity> {
    const flat = await this.flatService.findOne(id);
    return new FlatEntity(flat);
  }

  @Post()
  async create(@Body() createFlatDto: CreateFlatDto): Promise<FlatEntity> {
    const flat = await this.flatService.create(createFlatDto);
    return new FlatEntity(flat);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlatDto: UpdateFlatDto,
  ): Promise<FlatEntity> {
    const flat = await this.flatService.update(id, updateFlatDto);
    return new FlatEntity(flat);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.flatService.delete(id);
  }
}
