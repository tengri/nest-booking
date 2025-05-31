import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private BookingModel: Model<BookingDocument>,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.BookingModel.find().exec();
  }

  async findOne(id: string): Promise<Booking> {
    const Booking = await this.BookingModel.findById(id).exec();
    if (!Booking) {
      throw new NotFoundException('Booking not found');
    }
    return Booking;
  }

  checkBooking(newBooking: Booking, allFlatBookings: Booking[]): boolean {
    if (newBooking.startDate > newBooking.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (newBooking.startDate <= new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }

    for (const flatBooking of allFlatBookings) {
      const isNoOverlapping =
        newBooking.startDate > flatBooking.endDate ||
        newBooking.endDate < flatBooking.startDate;

      if (!isNoOverlapping) {
        throw new BadRequestException('Flat is already booked');
      }
    }

    return true;
  }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.BookingModel(createBookingDto);

    const allFlatBookings = await this.BookingModel.find({
      flatId: newBooking.flatId,
    }).exec();

    this.checkBooking(newBooking, allFlatBookings);

    return newBooking.save();
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const newBooking = new this.BookingModel(updateBookingDto);

    const allFlatBookings = await this.BookingModel.find({
      flatId: newBooking.flatId,
    }).exec();

    this.checkBooking(
      newBooking,
      allFlatBookings.filter((booking) => booking.id !== id),
    );

    const booking = await this.BookingModel.findByIdAndUpdate(id, newBooking, {
      new: true,
    }).exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async delete(id: string): Promise<Booking> {
    const Booking = await this.BookingModel.findByIdAndDelete(id).exec();
    if (!Booking) {
      throw new NotFoundException('Booking not found');
    }
    return Booking;
  }
}
