export interface BatchUpdateRequest<S, T> {
  ids: S[];
  value: T;
}
