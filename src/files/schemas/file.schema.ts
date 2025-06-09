import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileType } from 'src/types';

@Schema({
  timestamps: true,
})
export class FileModel {
  @Prop({ required: false })
  fileName: string;

  @Prop({ required: false })
  caption?: string;

  @Prop({ required: false })
  width?: number;

  @Prop({ required: false })
  height?: number;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  type: FileType;
}

export const FlatSchema = SchemaFactory.createForClass(FileModel);
