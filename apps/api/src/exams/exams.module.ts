import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { ExamSessionService } from './exam-session.service';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [ExamsController],
  providers: [ExamsService, ExamSessionService],
  exports: [ExamsService, ExamSessionService],
})
export class ExamsModule {}

