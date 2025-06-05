import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingDocument, BookingModel } from './schemas/bookings.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(BookingModel.name)
    private BookingModel: Model<BookingDocument>,
  ) {}

  async findAll(): Promise<BookingModel[]> {
    const bookings = await this.BookingModel.find().exec();
    return bookings.map((booking) => booking.toJSON());
  }

  async findOne(id: string): Promise<BookingModel> {
    const booking = await this.BookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking.toJSON();
  }

  checkBooking(
    newBooking: BookingModel,
    allFlatBookings: BookingModel[],
  ): boolean {
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

  async create(createBookingDto: CreateBookingDto): Promise<BookingModel> {
    const newBooking = new this.BookingModel(createBookingDto);

    const allFlatBookings = await this.BookingModel.find({
      flatId: newBooking.flatId,
    }).exec();

    this.checkBooking(newBooking, allFlatBookings);

    const booking = await newBooking.save();
    return booking.toJSON();
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<BookingModel> {
    const freshBooking = new this.BookingModel(updateBookingDto);

    const allFlatBookings = await this.BookingModel.find({
      flatId: freshBooking.flatId,
    }).exec();

    this.checkBooking(
      freshBooking,
      allFlatBookings.filter((booking) => booking.id !== id),
    );

    const booking = await this.BookingModel.findByIdAndUpdate(
      id,
      updateBookingDto,
      {
        new: true,
      },
    ).exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking.toJSON();
  }

  async delete(id: string): Promise<void> {
    const Booking = await this.BookingModel.findByIdAndDelete(id).exec();
    if (!Booking) {
      throw new NotFoundException('Booking not found');
    }
  }
}
