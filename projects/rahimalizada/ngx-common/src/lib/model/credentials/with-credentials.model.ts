import { WithUpdated } from '../../../public-api';
import { WithEmail } from '../with-email.model';
import { WithID } from '../with-id.model';
import { Credentials } from './credentials.model';
import { WithSecurityRoles } from './with-security-roles.model';

export interface WithCredentials<S> extends WithID<S>, WithUpdated, WithEmail, WithSecurityRoles {
  credentials: Credentials;
  id: S;
}
