import { HOMEWORK_COMPLAINT_CATEGORIES } from "@/lib/homework-ai/constants";
import type { AiProviderId, HomeworkComplaintCategory } from "@/lib/homework-ai/types";

export interface HomeworkAiPolicy {
  maxNormalSubmissionAttempts: number;
  allowLateSubmission: boolean;
  maxImagesPerSubmission: number;
  allowedStudentMimeTypes: string[];
  allowedAssignmentMimeTypes: string[];
  complaintCategories: HomeworkComplaintCategory[];
  activeProvider: AiProviderId;
}

const DEFAULT_HOMEWORK_AI_POLICY: HomeworkAiPolicy = {
  maxNormalSubmissionAttempts: 1,
  allowLateSubmission: true,
  maxImagesPerSubmission: 3,
  allowedStudentMimeTypes: ["image/jpeg", "image/png"],
  allowedAssignmentMimeTypes: [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ],
  complaintCategories: HOMEWORK_COMPLAINT_CATEGORIES,
  activeProvider:
    process.env.HOMEWORK_AI_PROVIDER === "mock" ? "mock" : "gemini",
};

export function getHomeworkAiPolicy(): HomeworkAiPolicy {
  return DEFAULT_HOMEWORK_AI_POLICY;
}
