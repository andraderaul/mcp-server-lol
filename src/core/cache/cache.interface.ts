export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs: number): Promise<void>;
  delete(pattern: string): Promise<void>;
  clear(): Promise<void>;
}
