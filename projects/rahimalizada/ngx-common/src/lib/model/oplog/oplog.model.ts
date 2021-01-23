import { WithID } from '@rahimalizada/ngx-jwt-auth';

export interface OpLog extends WithID<string> {
  id: string;
  userId?: string;
  ipAddress: string;
  method: string;
  path: string;
  headers: { [index: string]: string[] };
  params: { [index: string]: string[] };
  content?: string;
  error?: string;
  timestamp: Date;
}
