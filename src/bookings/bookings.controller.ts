import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './bookings.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ListResponse } from 'src/types';
import { BookingEntity } from './entities/bookings.entitiy';
import { CreateBookingDto } from './dto/create-booking.dto';

@UsePipes(new ValidationPipe())
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async findAll(): Promise<ListResponse<BookingEntity>> {
    const bookings = await this.bookingService.findAll();
    return {
      data: bookings.map((booking) => new BookingEntity(booking)),
      total: bookings.length,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookingEntity> {
    const booking = await this.bookingService.findOne(id);
    return new BookingEntity(booking);
  }

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingEntity> {
    const booking = await this.bookingService.create(createBookingDto);
    return new BookingEntity(booking);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<BookingEntity> {
    const booking = await this.bookingService.update(id, updateBookingDto);
    return new BookingEntity(booking);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.bookingService.delete(id);
  }
}
