import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ExamRequest,
  ExamResponse,
  examRequestSchema,
  examResponseSchema,
  SectionRequest,
  SectionResponse,
  sectionRequestSchema,
  sectionResponseSchema,
  QuestionRequest,
  QuestionResponse,
  questionRequestSchema,
  questionResponseSchema,
  GroupRequest,
  GroupResponse,
  groupRequestSchema,
  groupResponseSchema,
  ExamResultRequest,
  ExamResultResponse,
  examResultRequestSchema,
  examResultResponseSchema,
} from '@repo/types';
import { z } from 'zod';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  // ========== Exam CRUD ==========

  async findAll(isActive?: boolean): Promise<ExamResponse[]> {
    const where = isActive !== undefined ? { isActive } : {};
    const exams = await this.prisma.exam.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return z.array(examResponseSchema).parse(exams);
  }

  async findOne(id: string): Promise<ExamResponse> {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
            groups: {
              include: {
                questions: {
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Không tìm thấy đề thi');
    }

    // Use passthrough to allow additional fields and preserve sections
    return examResponseSchema.passthrough().parse(exam);
  }

  async findOneForExam(id: string): Promise<any> {
    // Return exam without correct answers for taking exam
    const exam = await this.prisma.exam.findUnique({
      where: { id, isActive: true },
      include: {
        sections: {
          include: {
            questions: {
              select: {
                id: true,
                section_id: true,
                group_id: true,
                questionText: true,
                options: true,
                correctAnswer: true, // Include correctAnswer for admin
                transcript: true,
                order: true,
                explanation: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: { order: 'asc' },
            },
            groups: {
              include: {
                questions: {
                  select: {
                    id: true,
                    section_id: true,
                    group_id: true,
                    questionText: true,
                    options: true,
                    correctAnswer: true, // Include correctAnswer for admin
                    transcript: true,
                    order: true,
                    explanation: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Không tìm thấy đề thi');
    }

    return exam;
  }

  async create(examRequest: ExamRequest): Promise<ExamResponse> {
    const validated = examRequestSchema.parse(examRequest);
    const exam = await this.prisma.exam.create({
      data: {
        ...validated,
        sections: {
          create: [
            {
              part: 1,
              name: 'Part 1: Mô Tả Hình Ảnh',
              description: 'Với mỗi câu hỏi, bạn sẽ được cho một bức hình, và chọn 1 đáp án đúng',
              order: 1,
            },
            {
              part: 2,
              name: 'Part 2: Câu Hỏi - Đáp Án',
              description: '25 câu hỏi, mỗi câu hỏi 3 đáp án',
              order: 2,
            },
            {
              part: 3,
              name: 'Part 3: Đoạn Hội Thoại',
              description: 'Đoạn hội thoại (group) sẽ có 3 câu hỏi về nội dung bài nghe, với tổng cộng 13 x 3 = 39 câu hỏi',
              order: 3,
            },
            {
              part: 4,
              name: 'Part 4: Bài Nói Ngắn',
              description: '30 câu hỏi, 10 nhóm mỗi nhóm 3 câu hỏi',
              order: 4,
            },
            {
              part: 5,
              name: 'Part 5: Hoàn Thành Câu',
              description: 'Câu hỏi đơn không group, 4 đáp án',
              order: 5,
            },
            {
              part: 6,
              name: 'Part 6: Hoàn Thành Đoạn Văn',
              description: 'Có 4 group (có chứa paragraph), mỗi group có 4 câu hỏi 4 đáp án',
              order: 6,
            },
            {
              part: 7,
              name: 'Part 7: Đọc Hiểu',
              description: 'Đọc hiểu với nhiều dạng bài đọc khác nhau',
              order: 7,
            },
          ],
        },
      },
    });
    return examResponseSchema.parse(exam);
  }

  async update(id: string, examRequest: ExamRequest): Promise<ExamResponse> {
    const validated = examRequestSchema.parse(examRequest);
    const exam = await this.prisma.exam.update({
      where: { id },
      data: validated,
    });
    return examResponseSchema.parse(exam);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exam.delete({
      where: { id },
    });
  }

  // ========== Section CRUD ==========

  async createSection(examId: string, sectionRequest: SectionRequest): Promise<SectionResponse> {
    const validated = sectionRequestSchema.parse(sectionRequest);
    const section = await this.prisma.section.create({
      data: {
        ...validated,
        exam_id: examId,
      },
    });
    return sectionResponseSchema.parse(section);
  }

  async updateSection(id: string, sectionRequest: SectionRequest): Promise<SectionResponse> {
    const validated = sectionRequestSchema.parse(sectionRequest);
    const section = await this.prisma.section.update({
      where: { id },
      data: validated,
    });
    return sectionResponseSchema.parse(section);
  }

  async deleteSection(id: string): Promise<void> {
    await this.prisma.section.delete({
      where: { id },
    });
  }

  // ========== Group CRUD ==========

  async createGroup(sectionId: string, groupRequest: GroupRequest): Promise<GroupResponse> {
    const validated = groupRequestSchema.parse(groupRequest);
    const group = await this.prisma.group.create({
      data: {
        ...validated,
        section_id: sectionId,
      },
    });
    return groupResponseSchema.parse(group);
  }

  async updateGroup(id: string, groupRequest: GroupRequest): Promise<GroupResponse> {
    const validated = groupRequestSchema.parse(groupRequest);
    const group = await this.prisma.group.update({
      where: { id },
      data: validated,
    });
    return groupResponseSchema.parse(group);
  }

  async deleteGroup(id: string): Promise<void> {
    await this.prisma.group.delete({
      where: { id },
    });
  }

  // ========== Question CRUD ==========

  async createQuestion(sectionId: string, questionRequest: QuestionRequest, groupId?: string): Promise<QuestionResponse> {
    const validated = questionRequestSchema.parse(questionRequest);
    const question = await this.prisma.question.create({
      data: {
        ...validated,
        section_id: sectionId,
        group_id: groupId || null,
      },
    });
    // Remove correctAnswer for response
    const { correctAnswer, ...response } = question;
    return questionResponseSchema.parse(response);
  }

  async updateQuestion(id: string, questionRequest: QuestionRequest): Promise<QuestionResponse> {
    const validated = questionRequestSchema.parse(questionRequest);
    const question = await this.prisma.question.update({
      where: { id },
      data: validated,
    });
    // Remove correctAnswer for response
    const { correctAnswer, ...response } = question;
    return questionResponseSchema.parse(response);
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.prisma.question.delete({
      where: { id },
    });
  }

  // ========== Exam Result ==========

  async submitExam(userId: string, examResultRequest: ExamResultRequest): Promise<ExamResultResponse> {
    const validated = examResultRequestSchema.parse(examResultRequest);
    
    // Get exam with all questions
    const exam = await this.prisma.exam.findUnique({
      where: { id: validated.exam_id },
      include: {
        sections: {
          include: {
            questions: true,
            groups: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Không tìm thấy đề thi');
    }

    // Collect all questions
    const allQuestions: any[] = [];
    exam.sections.forEach((section) => {
      // Questions without group (part 1, 2)
      allQuestions.push(...section.questions.filter((q) => !q.group_id));
      
      // Questions in groups (part 3, 4, 6, 7)
      section.groups.forEach((group) => {
        allQuestions.push(...group.questions);
      });
    });

    // Calculate scores
    let correctAnswers = 0;
    const examAnswers: any[] = [];

    allQuestions.forEach((question) => {
      const selectedAnswer = validated.answers[question.id] || null;
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      examAnswers.push({
        question_id: question.id,
        selectedAnswer,
        isCorrect,
      });
    });

    // Calculate listening and reading scores
    // Part 1-4: Listening, Part 5-7: Reading
    let listeningCorrect = 0;
    let readingCorrect = 0;
    let listeningTotal = 0;
    let readingTotal = 0;

    exam.sections.forEach((section) => {
      const isListening = section.part <= 4;
      const sectionQuestions: any[] = [];
      
      section.questions.filter((q) => !q.group_id).forEach((q) => {
        sectionQuestions.push(q);
      });
      
      section.groups.forEach((group) => {
        sectionQuestions.push(...group.questions);
      });

      sectionQuestions.forEach((question) => {
        const selectedAnswer = validated.answers[question.id] || null;
        const isCorrect = selectedAnswer === question.correctAnswer;

        if (isListening) {
          listeningTotal++;
          if (isCorrect) listeningCorrect++;
        } else {
          readingTotal++;
          if (isCorrect) readingCorrect++;
        }
      });
    });

    // Calculate TOEIC scores (simplified conversion)
    const listeningScore = Math.round((listeningCorrect / Math.max(listeningTotal, 1)) * 495);
    const readingScore = Math.round((readingCorrect / Math.max(readingTotal, 1)) * 495);
    const totalScore = listeningScore + readingScore;

    // Create exam result
    const examResult = await this.prisma.examResult.create({
      data: {
        user_id: userId,
        exam_id: validated.exam_id,
        score: totalScore,
        listeningScore,
        readingScore,
        totalQuestions: allQuestions.length,
        correctAnswers,
        timeSpent: validated.timeSpent,
        startedAt: validated.startedAt,
        completedAt: new Date(),
        answers: {
          create: examAnswers,
        },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    return examResultResponseSchema.parse(examResult);
  }

  async getUserResults(userId: string): Promise<ExamResultResponse[]> {
    const results = await this.prisma.examResult.findMany({
      where: { user_id: userId },
      include: {
        exam: true,
      },
      orderBy: { completedAt: 'desc' },
    });
    return z.array(examResultResponseSchema).parse(results);
  }

  async getResult(id: string, userId: string): Promise<ExamResultResponse> {
    const result = await this.prisma.examResult.findFirst({
      where: { id, user_id: userId },
      include: {
        exam: {
          include: {
            sections: {
              include: {
                questions: true,
                groups: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy kết quả');
    }

    return examResultResponseSchema.parse(result);
  }
}

