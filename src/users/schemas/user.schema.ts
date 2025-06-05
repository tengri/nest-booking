import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../types';

export type UserDocument = UserModel & Document;

@Schema({
  timestamps: true,
})
export class UserModel {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: Role.USER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
