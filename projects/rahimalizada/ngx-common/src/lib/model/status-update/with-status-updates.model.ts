import { StatusUpdate } from './status-update.model';
export interface WithStatusUpdates<T> {
  statusUpdates: StatusUpdate<T>[];
}
