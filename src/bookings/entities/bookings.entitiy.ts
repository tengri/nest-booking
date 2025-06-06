import { BookingDocument } from '../schemas/bookings.schema';

import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';

import { BookingSchema } from '../schemas/bookings.schema';

export class BookingEntity {
  constructor(partial: Partial<BookingDocument>) {
    Object.assign(this, partial);
  }

  @Exclude()
  _id: ObjectId;

  @Expose()
  @Transform(({ value }: { value: ObjectId }) => value.toString())
  id: string;

  @Expose()
  @Transform(({ value }: { value: ObjectId }) => value.toString())
  userId: string;

  @Expose()
  @Transform(({ value }: { value: ObjectId }) => value.toString())
  flatId: string;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  @Expose()
  comment: string;
}

BookingSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: BookingDocument) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
