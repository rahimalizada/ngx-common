import { CredentialsActivationCode } from './credentials-activation-code.model';
import { CredentialsResetCode } from './credentials-reset-code.model';

export interface Credentials {
  hash: string;
  activationCode?: CredentialsActivationCode;
  resetCode?: CredentialsResetCode;
}
