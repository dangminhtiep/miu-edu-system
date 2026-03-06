import { randomUUID } from "node:crypto";

import type {
  AiProviderId,
  HomeworkDatabase,
  HomeworkGradingJobRecord,
  HomeworkSubmissionRecord,
  ProviderGradingResponse,
} from "@/lib/homework-ai/types";
import { nowIso } from "@/lib/homework-ai/shared";

export function createQueuedGradingJob(
  submissionId: string,
  assignmentId: string,
  provider: AiProviderId,
  queuedAt: string,
): HomeworkGradingJobRecord {
  return {
    id: randomUUID(),
    submissionId,
    assignmentId,
    provider,
    status: "queued",
    attempts: 0,
    queuedAt,
    updatedAt: queuedAt,
  };
}

export function enqueueGradingJob(
  database: HomeworkDatabase,
  gradingJob: HomeworkGradingJobRecord,
) {
  database.gradingJobs.unshift(gradingJob);
}

export function markGradingJobProcessing(
  gradingJob: HomeworkGradingJobRecord,
  submission: HomeworkSubmissionRecord,
) {
  const startedAt = nowIso();
  gradingJob.status = "processing";
  gradingJob.attempts += 1;
  gradingJob.startedAt = startedAt;
  gradingJob.updatedAt = startedAt;
  submission.status = "processing";
  submission.updatedAt = startedAt;
}

export function markGradingJobCompleted(
  gradingJob: HomeworkGradingJobRecord,
  submission: HomeworkSubmissionRecord,
  gradingResponse: ProviderGradingResponse,
) {
  submission.provider = gradingResponse.provider;
  submission.model = gradingResponse.model;
  submission.promptVersion = gradingResponse.promptVersion;
  submission.status = gradingResponse.result.needsHumanReview
    ? "needs_review"
    : "graded";
  submission.updatedAt = nowIso();
  submission.result = gradingResponse.result;

  gradingJob.provider = gradingResponse.provider;
  gradingJob.status = "completed";
  gradingJob.completedAt = submission.updatedAt;
  gradingJob.updatedAt = submission.updatedAt;
  gradingJob.errorMessage = undefined;
}

export function markGradingJobFailed(
  gradingJob: HomeworkGradingJobRecord,
  submission: HomeworkSubmissionRecord,
  error: unknown,
) {
  submission.status = "failed";
  submission.updatedAt = nowIso();
  submission.errorMessage =
    error instanceof Error ? error.message : "Khong xac dinh duoc loi cham bai.";

  gradingJob.status = "failed";
  gradingJob.completedAt = submission.updatedAt;
  gradingJob.updatedAt = submission.updatedAt;
  gradingJob.errorMessage = submission.errorMessage;
}
