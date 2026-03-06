export type AiProviderId = "gemini" | "mock";

export type SubmissionStatus =
  | "queued"
  | "processing"
  | "graded"
  | "needs_review"
  | "failed";

export type GradingJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type ComplaintStatus = "open" | "unlocked" | "resolved";
export type HomeworkComplaintCategory = "grading_issue" | "wrong_submission";

export type ConfidenceLevel = "high" | "medium" | "low";

export type RubricCriterionKey =
  | "analysis_and_strategy"
  | "calculation_skill"
  | "presentation";

export interface HomeworkFileRecord {
  id: string;
  filename: string;
  mimeType: string;
  base64Data?: string;
  publicUrl: string;
}

export interface RubricCriterion {
  key: RubricCriterionKey;
  label: string;
  maxScore: number;
  notes: string;
}

export interface HomeworkAssignmentRecord {
  id: string;
  classCode: string;
  title: string;
  instructions: string;
  answerKey: string;
  attachments: HomeworkFileRecord[];
  rubric: RubricCriterion[];
  maxScore: number;
  startsAt: string;
  dueAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkSubmissionInput {
  assignment: HomeworkAssignmentRecord;
  studentName: string;
  classCode: string;
  attemptNumber: number;
  isLate: boolean;
  images: HomeworkFileRecord[];
}

export interface GradingCriterionScore {
  criterionKey: RubricCriterionKey;
  label: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface NormalizedGradingResult {
  totalScore: number;
  maxScore: number;
  confidence: ConfidenceLevel;
  needsHumanReview: boolean;
  reviewReason: string;
  ocrQuality: ConfidenceLevel;
  recognizedText: string;
  praise: string;
  mistakesToNote: string[];
  improvementSuggestions: string[];
  criteriaScores: GradingCriterionScore[];
}

export interface ProviderGradingResponse {
  provider: AiProviderId;
  model: string;
  promptVersion: string;
  result: NormalizedGradingResult;
  rawResponse: unknown;
}

export interface HomeworkGradingJobRecord {
  id: string;
  submissionId: string;
  assignmentId: string;
  provider: AiProviderId;
  status: GradingJobStatus;
  attempts: number;
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface HomeworkSubmissionRecord {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  classCode: string;
  attemptNumber: number;
  isLate: boolean;
  imageUrls: string[];
  provider: AiProviderId;
  model: string;
  promptVersion: string;
  status: SubmissionStatus;
  submittedAt: string;
  updatedAt: string;
  result?: NormalizedGradingResult;
  errorMessage?: string;
}

export interface HomeworkComplaintRecord {
  id: string;
  assignmentId: string;
  submissionId: string;
  studentName: string;
  classCode: string;
  category: HomeworkComplaintCategory;
  message: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  unlockId?: string;
}

export interface HomeworkUnlockRecord {
  id: string;
  assignmentId: string;
  studentName: string;
  complaintId: string;
  createdAt: string;
  usedAt?: string;
}

export interface HomeworkDatabase {
  assignments: HomeworkAssignmentRecord[];
  submissions: HomeworkSubmissionRecord[];
  gradingJobs: HomeworkGradingJobRecord[];
  complaints: HomeworkComplaintRecord[];
  unlocks: HomeworkUnlockRecord[];
}
