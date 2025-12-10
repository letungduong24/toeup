import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    this.client = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  // Get value by key
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  // Set value with optional expiration (in seconds)
  async set(key: string, value: string, expiration?: number): Promise<void> {
    if (expiration) {
      await this.client.setex(key, expiration, value);
    } else {
      await this.client.set(key, value);
    }
  }

  // Delete key
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  // Set expiration for existing key
  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  // Get remaining TTL
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  // Hash operations
  async hget(key: string, field: string): Promise<string | null> {
    return await this.client.hget(key, field);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.client.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.client.hdel(key, field);
  }

  // Get Redis client (for advanced operations)
  getClient(): Redis {
    return this.client;
  }
}

