import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZodValidationPipe } from 'nestjs-zod'
import { APP_PIPE } from '@nestjs/core'
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FoldersModule } from './folders/folders.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { StudyModule } from './study/study.module';
import { PracticeModule } from './practice/practice.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env']
    }),
    AuthModule,
    FoldersModule,
    FlashcardsModule,
    StudyModule,
    PracticeModule,
    AttendanceModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  controllers: [AppController,],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    AppService
  ],
})
export class AppModule { }
