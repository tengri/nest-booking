import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileModel } from 'src/files/schemas/file.schema';

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

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: [] })
  files: FileModel[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  residence: string;

  @Prop({ required: true })
  floor: number;

  @Prop({ required: true })
  totalFloors: number;

  @Prop({ required: true })
  area: number;

  @Prop({ required: true, default: [] })
  tags: { name: string; icon?: string }[];
}

export const FlatSchema = SchemaFactory.createForClass(FlatModel);
