export interface ListResponse<T> {
  data: T[];
  total: number;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface JwtPayload {
  sub: string;
  role: Role;
  email: string;
}

export enum FileType {
  PHOTO = 'photo',
  VIDEO = 'video',
}
