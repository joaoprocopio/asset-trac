export type DeepAwaited<T> =
  T extends Promise<infer U>
    ? DeepAwaited<U>
    : T extends object
      ? { [P in keyof T]: DeepAwaited<T[P]> }
      : T
