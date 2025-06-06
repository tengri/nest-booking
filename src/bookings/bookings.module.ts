import { Module } from '@nestjs/common';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { BookingModel, BookingSchema } from './schemas/bookings.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    MongooseModule.forFeature([
      { name: BookingModel.name, schema: BookingSchema },
    ]),
  ],
})
export class BookingModule {}
