export type UserRole = 'admin' | 'student';

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

export interface User {
  id: string;
  nis: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  className: string; // e.g., 'XII-UTBK', 'XI-IPA', 'X-IPA', 'SEMUA'
  status: AccountStatus;
  createdAt: string;
  avatar?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface ExamCategory {
  id: string;
  name: string;
  description: string;
}

export type MaterialType = 'PDF' | 'PPT' | 'VIDEO' | 'DRIVE';

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  targetClass: string; // e.g. 'XII-UTBK' or 'SEMUA'
  mediaType: MaterialType;
  url: string;
  createdAt: string;
}

export type ExamMode = 'NATIVE_CBT' | 'EMBED_DRIVE_PDF';

export type QuestionType = 'SINGLE_CHOICE' | 'COMPLEX_CHOICE' | 'TRUE_FALSE' | 'ESSAY';

export type QuestionDifficulty = 'mudah' | 'sedang' | 'sulit' | 'hots';

export interface TrueFalseStatement {
  id: string;
  text: string;
  correctAnswer: 'TRUE' | 'FALSE';
}

export interface QuestionOption {
  key: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
  imageUrl?: string; // Optional image URL for option choice
}

export interface Question {
  id: string;
  number: number;
  text: string;
  imageUrl?: string;
  imageWidth?: 'small' | 'medium' | 'large' | 'full'; // 'small': 200px, 'medium': 400px, 'large': 600px, 'full': 100%
  imageAlign?: 'left' | 'center' | 'right';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  questionType: QuestionType;
  options?: QuestionOption[];
  statements?: TrueFalseStatement[]; // Multi-statement for TRUE_FALSE table questions
  correctAnswer: string | string[] | Record<string, 'TRUE' | 'FALSE'>; // Single choice: 'A', Complex: ['A','C'], True/False: 'TRUE' or Record<statementId, 'TRUE'|'FALSE'>, Essay: 'keyword text'
  weight: number; // default 1 (bobot nilai per soal)
  discussion?: string; // Pembahasan Soal
  difficulty?: QuestionDifficulty; // Level Kesulitan Soal: mudah, sedang, sulit, hots
}

export interface Exam {
  id: string;
  title: string;
  category: string;
  targetClass: string;
  durationMinutes: number;
  mode: ExamMode;
  pdfDriveUrl?: string; // Link Embed PDF Google Drive
  token: string;
  isTokenPublic: boolean;
  shuffleQuestions: boolean;
  passingScore: number; // e.g. 70
  allowRetake?: boolean; // Pengerjaan berulang
  maxAttempts?: number; // Maksimal pengerjaan (default 1)
  showDiscussion?: boolean; // Izinkan siswa melihat pembahasan & analisis per nomor soal setelah ujian
  isCatEnabled?: boolean; // Computer Adaptive Test (CAT) system toggle for CBT
  catQuestionCount?: number; // Jumlah soal CAT yang akan ditampilkan ke siswa
  deadline: string;
  questions: Question[];
  totalQuestions: number;
  createdAt: string;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[] | Record<string, 'TRUE' | 'FALSE'>; // 'A', ['A','C'], 'TRUE' or Record<statementId, 'TRUE'|'FALSE'> or essay text
  isDoubtful?: boolean; // Ragu-ragu
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  examCategory: string;
  studentId: string;
  studentNis: string;
  studentName: string;
  studentClass: string;
  answers: Record<string, StudentAnswer>;
  manualScores?: Record<string, number>; // Mapping questionId -> skor manual yang diinputkan/dikoreksi admin
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  submittedAt: string;
  durationSpentSeconds: number;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface MarketplaceCategory {
  id: string;
  name: string;
  description?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  externalLink: string; // Link Shopee/Tokopedia/WhatsApp
  status: ProductStatus;
  createdAt: string;
}

export interface FeaturedProgram {
  id: string;
  title: string;          // e.g. "Lolos PTN Impian"
  category: string;       // e.g. "Persiapan UTBK SNBT 2026"
  thumbnail: string;      // Image URL
  shortDesc: string;      // Brief summary for card thumbnail
  articleContent: string; // Detailed article / syllabus for "Lihat Selengkapnya"
  registerUrl: string;    // WhatsApp or Google Form link
  badge?: string;         // e.g. "TERFAVORIT", "INTENSIF", "EXCLUSIVE"
  isPublished: boolean;
  createdAt: string;
}

export interface InstitutionInfo {
  name: string;
  subtitle: string;
  logoUrl: string;
}

