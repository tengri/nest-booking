import { Exclude, Expose, Transform } from 'class-transformer';
import { FlatDocument, FlatSchema } from '../schemas/flat.schema';
import { ObjectId } from 'mongodb';

export class FlatEntity {
  constructor(partial: Partial<FlatDocument>) {
    Object.assign(this, partial);
  }

  @Exclude()
  _id: ObjectId;

  @Expose()
  @Transform(({ value }: { value: ObjectId }) => value.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  capacity: number;

  @Expose()
  photos: string[];

  @Expose()
  address: string;

  @Expose()
  price: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  residence: string;

  @Expose()
  coordinates: { lat: number; lng: number };

  @Expose()
  tags: { name: string; icon?: string }[];
}

FlatSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: FlatDocument) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
