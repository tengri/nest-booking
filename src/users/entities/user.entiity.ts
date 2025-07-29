import { Exclude, Expose } from 'class-transformer';
import { UserSchema, UserDocument } from '../schemas/user.schema';
import { Role } from '../../types';

export class UserEntity {
  constructor(partial: Partial<UserDocument>) {
    Object.assign(this, partial);
  }

  @Exclude()
  _id: string;

  @Expose()
  id: string;

  @Exclude()
  password: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;
}

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: Record<string, any>) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
