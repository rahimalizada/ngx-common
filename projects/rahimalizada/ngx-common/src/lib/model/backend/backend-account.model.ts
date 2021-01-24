import { WithCredentials } from '../credentials/with-credentials.model';

export interface BackendAccount extends WithCredentials<string> {
  id: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  accountRoles: string[];
  permissions: string[];
  roleNames: string[];
}
