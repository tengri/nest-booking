import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FlatDocument = Flat & Document;

@Schema()
export class Flat {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FlatSchema = SchemaFactory.createForClass(Flat);
