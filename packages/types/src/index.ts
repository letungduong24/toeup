// Common
export * from "./common/pagination.schema";

// User
export * from "./user/signin.request";
export * from "./user/signup.request";
export * from "./user/user.schema";

// Folder
export * from "./folder/folder.schema";

// Flashcard
export * from "./flashcard/usage.schema";
export * from "./flashcard/flashcard.schema";

// Practice
export * from "./practice/practice.schema";

// Exam - export specific types to avoid conflicts with practice schema
export {
  examSchema,
  examRequestSchema,
  examResponseSchema,
  sectionSchema,
  sectionRequestSchema,
  sectionResponseSchema,
  groupSchema,
  groupRequestSchema,
  groupResponseSchema,
  questionOptionSchema,
  questionSchema as examQuestionSchema,
  questionRequestSchema as examQuestionRequestSchema,
  questionResponseSchema as examQuestionResponseSchema,
  questionWithAnswerSchema as examQuestionWithAnswerSchema,
  sectionWithRelationsSchema,
  examResultSchema,
  examResultRequestSchema,
  examResultResponseSchema,
  examAnswerSchema,
  examSessionSchema,
  createExamFormSchema,
} from "./exam/exam.schema";

export type {
  Exam,
  ExamRequest,
  ExamResponse,
  Section,
  SectionRequest,
  SectionResponse,
  Group,
  GroupRequest,
  GroupResponse,
  QuestionOption,
  Question as ExamQuestion,
  QuestionRequest as ExamQuestionRequest,
  QuestionResponse as ExamQuestionResponse,
  QuestionWithAnswer as ExamQuestionWithAnswer,
  SectionWithRelations,
  ExamResult,
  ExamResultRequest,
  ExamResultResponse,
  ExamAnswer,
  ExamSession,
  CreateExamForm,
} from "./exam/exam.schema";
