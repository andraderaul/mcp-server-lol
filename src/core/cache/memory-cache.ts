import type { Cache } from "./cache.interface.js";

export class MemoryCache implements Cache {
  private store = new Map<string, { value: unknown; expires: number }>();
  private metrics = { hits: 0, misses: 0, sets: 0 };
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.metrics.misses++;
      this.store.delete(key);
      return null;
    }

    this.metrics.hits++;
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    if (this.store.size > this.maxSize) {
      this.cleanupExpired();
    }

    this.store.set(key, {
      value,
      expires: Date.now() + ttlMs,
    });
  }

  async delete(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace("*", ".*"));

    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      ...this.metrics,
      hitRate:
        total > 0 ? `${((this.metrics.hits / total) * 100).toFixed(1)}%` : "0%",
    };
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expires) {
        this.store.delete(key);
      }
    }
  }
}
