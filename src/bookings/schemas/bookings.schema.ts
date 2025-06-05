import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BookingDocument = BookingModel & Document;

@Schema({
  timestamps: true,
})
export class BookingModel extends Document {
  @Prop()
  name: string;

  @Prop()
  userId: string;

  @Prop({ required: true, ref: 'Flat', type: mongoose.Schema.Types.ObjectId })
  flatId: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  comment: string;
}

export const BookingSchema = SchemaFactory.createForClass(BookingModel);
