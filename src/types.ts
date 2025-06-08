export interface ListResponse<T> {
  data: T[];
  total: number;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

