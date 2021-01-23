import { WithCredentials } from './../credentials/with-credentials.model';

export interface AuthResult<T extends WithCredentials<S>, S> {
  subject: T;
  token: string;
  refreshToken: string;
  roles: string[];
}
