import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
})
export class BookingModule {}
