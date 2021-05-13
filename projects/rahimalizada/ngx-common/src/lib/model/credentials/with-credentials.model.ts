import { WithUpdated } from '../../../public-api';
import { WithEmail } from '../with-email.model';
import { WithID } from '../with-id.model';
import { Credentials } from './credentials.model';
import { WithPermissions } from './with-permissions.model';

export interface WithCredentials<S> extends WithID<S>, WithUpdated, WithEmail, WithPermissions {
  credentials: Credentials;
  id: S;
}
