/**
 * 简单的内存缓存工具
 * 用于缓存频繁访问的数据，减少数据库查询
 */

interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number; // 默认过期时间（秒）

  constructor(defaultTTL: number = 300) { // 默认5分钟
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    
    // 每分钟清理一次过期的缓存
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL) * 1000;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * 获取或设置缓存（如果不存在则执行函数）
   */
  async getOrSet<T>(
    key: string, 
    fn: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fn();
    this.set(key, data, ttl);
    return data;
  }
}

// 导出单例实例
export const cache = new MemoryCache(300); // 5分钟过期

// 预定义的缓存键前缀
export const CacheKeys = {
  USER: (id: string) => `user:${id}`,
  USER_LIST: (params: string) => `users:list:${params}`,
  PROMPT: (id: string) => `prompt:${id}`,
  PROMPT_LIST: (params: string) => `prompts:list:${params}`,
  DASHBOARD_STATS: 'dashboard:stats',
  TOP_PROMPTS: (limit: number) => `top:prompts:${limit}`,
  USER_GROWTH: 'user:growth',
};

