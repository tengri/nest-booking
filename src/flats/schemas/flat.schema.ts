import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FlatDocument = FlatModel & Document;

@Schema({
  timestamps: true,
})
export class FlatModel {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FlatSchema = SchemaFactory.createForClass(FlatModel);
