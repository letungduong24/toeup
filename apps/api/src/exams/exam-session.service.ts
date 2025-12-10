import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import {
  ExamSession,
  examSessionSchema,
} from '@repo/types';
import { z } from 'zod';

@Injectable()
export class ExamSessionService {
  private readonly SESSION_PREFIX = 'exam:session:';
  private readonly SESSION_TTL = 60 * 60 * 3; // 3 hours

  constructor(private redis: RedisService) {}

  private getSessionKey(userId: string, examId: string): string {
    return `${this.SESSION_PREFIX}${userId}:${examId}`;
  }

  async getSession(userId: string, examId: string): Promise<ExamSession | null> {
    const key = this.getSessionKey(userId, examId);
    const data = await this.redis.get(key);
    
    if (!data) {
      return null;
    }

    try {
      const parsed = JSON.parse(data);
      return examSessionSchema.parse(parsed);
    } catch (error) {
      return null;
    }
  }

  async createSession(session: ExamSession): Promise<void> {
    const key = this.getSessionKey(session.user_id, session.exam_id);
    const data = JSON.stringify(session);
    await this.redis.set(key, data, this.SESSION_TTL);
  }

  async updateSession(userId: string, examId: string, updates: Partial<ExamSession>): Promise<void> {
    const existing = await this.getSession(userId, examId);
    
    if (!existing) {
      throw new Error('Session not found');
    }

    const updated: ExamSession = {
      ...existing,
      ...updates,
    };

    const key = this.getSessionKey(userId, examId);
    const data = JSON.stringify(updated);
    await this.redis.set(key, data, this.SESSION_TTL);
  }

  async updateAnswer(userId: string, examId: string, questionId: string, answer: string | null): Promise<void> {
    const session = await this.getSession(userId, examId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    session.answers[questionId] = answer;
    await this.updateSession(userId, examId, { answers: session.answers });
  }

  async updateTimeRemaining(userId: string, examId: string, timeRemaining: number): Promise<void> {
    await this.updateSession(userId, examId, { timeRemaining });
  }

  async deleteSession(userId: string, examId: string): Promise<void> {
    const key = this.getSessionKey(userId, examId);
    await this.redis.del(key);
  }

  async extendSession(userId: string, examId: string): Promise<void> {
    const key = this.getSessionKey(userId, examId);
    await this.redis.expire(key, this.SESSION_TTL);
  }

  async getTimeRemaining(userId: string, examId: string): Promise<number | null> {
    const session = await this.getSession(userId, examId);
    return session?.timeRemaining ?? null;
  }
}

