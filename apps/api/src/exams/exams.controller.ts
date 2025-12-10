import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamSessionService } from './exam-session.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { createZodDto } from 'nestjs-zod';
import {
  examRequestSchema,
  sectionRequestSchema,
  questionRequestSchema,
  groupRequestSchema,
  examResultRequestSchema,
} from '@repo/types';

// DTOs
class ExamDto extends createZodDto(examRequestSchema) {}
class SectionDto extends createZodDto(sectionRequestSchema) {}
class QuestionDto extends createZodDto(questionRequestSchema) {}
class GroupDto extends createZodDto(groupRequestSchema) {}
class ExamResultDto extends createZodDto(examResultRequestSchema) {}

@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
    private readonly examSessionService: ExamSessionService,
  ) {}

  // ========== Exam CRUD ==========

  @Get()
  async findAll(@Body('isActive') isActive?: boolean) {
    return await this.examsService.findAll(isActive);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.examsService.findOne(id);
  }

  @Get(':id/take')
  @UseGuards(JwtAuthGuard)
  async findOneForExam(@Param('id') id: string) {
    return await this.examsService.findOneForExam(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() examDto: ExamDto) {
    return await this.examsService.create(examDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() examDto: ExamDto) {
    return await this.examsService.update(id, examDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    await this.examsService.delete(id);
    return { message: 'Xóa đề thi thành công' };
  }

  // ========== Section CRUD ==========

  @Post(':examId/sections')
  @UseGuards(JwtAuthGuard)
  async createSection(
    @Param('examId') examId: string,
    @Body() sectionDto: SectionDto,
  ) {
    return await this.examsService.createSection(examId, sectionDto);
  }

  @Patch('sections/:id')
  @UseGuards(JwtAuthGuard)
  async updateSection(
    @Param('id') id: string,
    @Body() sectionDto: SectionDto,
  ) {
    return await this.examsService.updateSection(id, sectionDto);
  }

  @Delete('sections/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSection(@Param('id') id: string) {
    await this.examsService.deleteSection(id);
    return { message: 'Xóa section thành công' };
  }

  // ========== Group CRUD ==========

  @Post('sections/:sectionId/groups')
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @Param('sectionId') sectionId: string,
    @Body() groupDto: GroupDto,
  ) {
    return await this.examsService.createGroup(sectionId, groupDto);
  }

  @Patch('groups/:id')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Param('id') id: string,
    @Body() groupDto: GroupDto,
  ) {
    return await this.examsService.updateGroup(id, groupDto);
  }

  @Delete('groups/:id')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@Param('id') id: string) {
    await this.examsService.deleteGroup(id);
    return { message: 'Xóa group thành công' };
  }

  // ========== Question CRUD ==========

  @Post('sections/:sectionId/questions')
  @UseGuards(JwtAuthGuard)
  async createQuestion(
    @Param('sectionId') sectionId: string,
    @Body() questionDto: QuestionDto & { groupId?: string },
  ) {
    return await this.examsService.createQuestion(
      sectionId,
      questionDto,
      questionDto.groupId,
    );
  }

  @Patch('questions/:id')
  @UseGuards(JwtAuthGuard)
  async updateQuestion(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
  ) {
    return await this.examsService.updateQuestion(id, questionDto);
  }

  @Delete('questions/:id')
  @UseGuards(JwtAuthGuard)
  async deleteQuestion(@Param('id') id: string) {
    await this.examsService.deleteQuestion(id);
    return { message: 'Xóa question thành công' };
  }

  // ========== Exam Session (Redis) ==========

  @Get(':examId/session')
  @UseGuards(JwtAuthGuard)
  async getSession(@Request() req: any, @Param('examId') examId: string) {
    const userId = req.user.sub;
    const session = await this.examSessionService.getSession(userId, examId);
    
    if (!session) {
      return { session: null };
    }

    return { session };
  }

  @Post(':examId/session')
  @UseGuards(JwtAuthGuard)
  async createSession(
    @Request() req: any,
    @Param('examId') examId: string,
    @Body() body: { timeRemaining: number },
  ) {
    const userId = req.user.sub;
    const session = {
      exam_id: examId,
      user_id: userId,
      startedAt: new Date(),
      timeRemaining: body.timeRemaining,
      answers: {},
    };
    
    await this.examSessionService.createSession(session);
    return { session };
  }

  @Patch(':examId/session/answer')
  @UseGuards(JwtAuthGuard)
  async updateAnswer(
    @Request() req: any,
    @Param('examId') examId: string,
    @Body() body: { questionId: string; answer: string | null },
  ) {
    const userId = req.user.sub;
    await this.examSessionService.updateAnswer(
      userId,
      examId,
      body.questionId,
      body.answer,
    );
    return { message: 'Cập nhật đáp án thành công' };
  }

  @Patch(':examId/session/time')
  @UseGuards(JwtAuthGuard)
  async updateTime(
    @Request() req: any,
    @Param('examId') examId: string,
    @Body() body: { timeRemaining: number },
  ) {
    const userId = req.user.sub;
    await this.examSessionService.updateTimeRemaining(
      userId,
      examId,
      body.timeRemaining,
    );
    return { message: 'Cập nhật thời gian thành công' };
  }

  @Delete(':examId/session')
  @UseGuards(JwtAuthGuard)
  async deleteSession(@Request() req: any, @Param('examId') examId: string) {
    const userId = req.user.sub;
    await this.examSessionService.deleteSession(userId, examId);
    return { message: 'Xóa session thành công' };
  }

  // ========== Exam Result ==========

  @Post(':examId/submit')
  @UseGuards(JwtAuthGuard)
  async submitExam(
    @Request() req: any,
    @Param('examId') examId: string,
    @Body() examResultDto: ExamResultDto,
  ) {
    const userId = req.user.sub;
    
    // Delete session after submission
    await this.examSessionService.deleteSession(userId, examId);
    
    return await this.examsService.submitExam(userId, examResultDto);
  }

  @Get('results/my')
  @UseGuards(JwtAuthGuard)
  async getMyResults(@Request() req: any) {
    const userId = req.user.sub;
    return await this.examsService.getUserResults(userId);
  }

  @Get('results/:id')
  @UseGuards(JwtAuthGuard)
  async getResult(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return await this.examsService.getResult(id, userId);
  }
}

