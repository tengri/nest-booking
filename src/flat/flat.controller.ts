import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FlatService } from './flat.service';
import { Flat } from './schemas/flat.schema';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';

@Controller('flats')
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Get()
  async findAll(): Promise<Flat[]> {
    return this.flatService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Flat> {
    return this.flatService.findOne(id);
  }

  @Post()
  async create(@Body() createFlatDto: CreateFlatDto): Promise<Flat> {
    return this.flatService.create(createFlatDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlatDto: UpdateFlatDto,
  ): Promise<Flat> {
    return this.flatService.update(id, updateFlatDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.flatService.delete(id);
    return;
  }
}
