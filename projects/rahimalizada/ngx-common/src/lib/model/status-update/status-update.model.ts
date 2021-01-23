export interface StatusUpdate<T> {
  accountId: string;
  status: T;
  created: Date;
  notes?: string;
}
