import { z } from "zod";

// Exam base schema
export const examSchema = z.object({
  id: z.cuid(),
  title: z.string().min(1, "Tên đề thi không được để trống"),
  description: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  duration: z.number().int().positive().default(120), // minutes
  totalScore: z.number().int().positive().default(990),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Exam = z.infer<typeof examSchema>;

// Exam request schema (for creating/updating)
export const examRequestSchema = examSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ExamRequest = z.infer<typeof examRequestSchema>;

// Section schema
export const sectionSchema = z.object({
  id: z.cuid(),
  exam_id: z.cuid(),
  part: z.number().int().min(1).max(7),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  order: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Section = z.infer<typeof sectionSchema>;

// Section request schema
export const sectionRequestSchema = sectionSchema.omit({
  id: true,
  exam_id: true,
  createdAt: true,
  updatedAt: true,
});

export type SectionRequest = z.infer<typeof sectionRequestSchema>;

// Section response schema
export const sectionResponseSchema = sectionSchema;

export type SectionResponse = z.infer<typeof sectionResponseSchema>;

// Group schema
export const groupSchema = z.object({
  id: z.cuid(),
  section_id: z.cuid(),
  paragraph: z.string().nullable().optional(), // Paragraph cho bài đọc (part 6, 7), null cho part 3, 4
  order: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Group = z.infer<typeof groupSchema>;

// Group request schema
export const groupRequestSchema = groupSchema.omit({
  id: true,
  section_id: true,
  createdAt: true,
  updatedAt: true,
});

export type GroupRequest = z.infer<typeof groupRequestSchema>;

// Group response schema
export const groupResponseSchema = groupSchema;

export type GroupResponse = z.infer<typeof groupResponseSchema>;

// Question option schema
export const questionOptionSchema = z.object({
  text: z.string(),
  value: z.string(),
});

export type QuestionOption = z.infer<typeof questionOptionSchema>;

// Question schema
export const questionSchema = z.object({
  id: z.cuid(),
  section_id: z.cuid(),
  group_id: z.cuid().nullable().optional(),
  questionText: z.string().nullable().optional(),
  options: z.array(questionOptionSchema),
  correctAnswer: z.string(),
  transcript: z.string().nullable().optional(),
  order: z.number().int().nonnegative(),
  explanation: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Question = z.infer<typeof questionSchema>;

// Question request schema
export const questionRequestSchema = questionSchema.omit({
  id: true,
  section_id: true,
  createdAt: true,
  updatedAt: true,
});

export type QuestionRequest = z.infer<typeof questionRequestSchema>;

// Question response schema (without correctAnswer for exam taking)
export const questionResponseSchema = questionSchema.omit({
  correctAnswer: true,
});

export type QuestionResponse = z.infer<typeof questionResponseSchema>;

// Question with answer schema (for results)
export const questionWithAnswerSchema = questionSchema;

export type QuestionWithAnswer = z.infer<typeof questionWithAnswerSchema>;

// Section with nested relations schema (for exam response - admin view with correctAnswer)
export const sectionWithRelationsSchema = sectionSchema.extend({
  questions: z.array(questionSchema).optional(),
  groups: z.array(groupSchema.extend({
    questions: z.array(questionSchema).optional(),
  })).optional(),
});

export type SectionWithRelations = z.infer<typeof sectionWithRelationsSchema>;

// Exam response schema (with optional sections for admin view)
export const examResponseSchema = examSchema.extend({
  sections: z.array(sectionWithRelationsSchema).optional(),
});

export type ExamResponse = z.infer<typeof examResponseSchema>;

// Exam result schema
export const examResultSchema = z.object({
  id: z.cuid(),
  user_id: z.cuid(),
  exam_id: z.cuid(),
  score: z.number().int().nonnegative(),
  listeningScore: z.number().int().nonnegative().nullable().optional(),
  readingScore: z.number().int().nonnegative().nullable().optional(),
  totalQuestions: z.number().int().positive(),
  correctAnswers: z.number().int().nonnegative(),
  timeSpent: z.number().int().nonnegative(), // seconds
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ExamResult = z.infer<typeof examResultSchema>;

// Exam result request schema (for submitting)
export const examResultRequestSchema = z.object({
  exam_id: z.cuid(),
  answers: z.record(z.string(), z.string().nullable()), // question_id -> selectedAnswer
  timeSpent: z.number().int().nonnegative(),
  startedAt: z.coerce.date(),
});

export type ExamResultRequest = z.infer<typeof examResultRequestSchema>;

// Exam result response schema
export const examResultResponseSchema = examResultSchema;

export type ExamResultResponse = z.infer<typeof examResultResponseSchema>;

// Exam answer schema
export const examAnswerSchema = z.object({
  id: z.cuid(),
  examResult_id: z.cuid(),
  question_id: z.cuid(),
  selectedAnswer: z.string().nullable().optional(),
  isCorrect: z.boolean().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ExamAnswer = z.infer<typeof examAnswerSchema>;

// Exam session schema (for Redis)
export const examSessionSchema = z.object({
  exam_id: z.cuid(),
  user_id: z.cuid(),
  startedAt: z.coerce.date(),
  timeRemaining: z.number().int().nonnegative(), // seconds
  answers: z.record(z.string(), z.string().nullable()), // question_id -> selectedAnswer
});

export type ExamSession = z.infer<typeof examSessionSchema>;

// Create exam form schema (with validation messages)
export const createExamFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  audioUrl: z.string().optional().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: 'URL không hợp lệ' }
  ),
  duration: z.coerce.number().int().positive('Thời gian phải là số dương'),
  totalScore: z.coerce.number().int().positive('Tổng điểm phải là số dương'),
  isActive: z.boolean().default(true),
});

export type CreateExamForm = z.infer<typeof createExamFormSchema>;

