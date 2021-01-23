import { WithID } from '../with-id.model';

export interface AuthResult<T extends WithID<S>, S> {
  subject: T;
  token: string;
  refreshToken: string;
  roles: string[];
}
