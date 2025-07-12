import { Exclude, Expose, Transform } from 'class-transformer';
import { UserDocument, UserSchema } from '../schemas/user.schema';
import { ObjectId } from 'mongodb';
import { Role } from '../../types';

export class UserEntity {
  constructor(partial: Partial<UserDocument>) {
    Object.assign(this, partial);
  }

  @Exclude()
  _id?: ObjectId;

  @Expose()
  @Transform(({ value }: { value: ObjectId }) => value.toString())
  id: string;

  @Exclude()
  password: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;
}

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: UserDocument) => {
    const { _id, ...rest } = ret;
    return { id: _id, ...rest };
  },
});
