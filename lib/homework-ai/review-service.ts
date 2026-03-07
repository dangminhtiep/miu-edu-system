import { randomUUID } from "node:crypto";

import { getHomeworkAiRepository } from "@/lib/homework-ai/file-repository";
import { nowIso } from "@/lib/homework-ai/shared";
import type {
  ConfidenceLevel,
  GradingCriterionScore,
  HomeworkComplaintRecord,
  HomeworkReviewDecision,
  HomeworkReviewRecord,
  HomeworkReviewSource,
  NormalizedGradingResult,
} from "@/lib/homework-ai/types";

function asConfidenceLevel(value: string, fallback: ConfidenceLevel): ConfidenceLevel {
  return value === "high" || value === "medium" || value === "low" ? value : fallback;
}

function clampScore(score: number, maxScore: number) {
  return Math.min(Math.max(score, 0), maxScore);
}

function parseTextList(value: string, fallback: string[]) {
  const items = value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function buildApprovedFinalResult(result: NormalizedGradingResult): NormalizedGradingResult {
  return {
    ...result,
    needsHumanReview: false,
    reviewReason: "",
  };
}

function buildEditedFinalResult(
  formData: FormData,
  baseResult: NormalizedGradingResult,
): NormalizedGradingResult {
  const criteriaScores: GradingCriterionScore[] = baseResult.criteriaScores.map((criterion) => {
    const scoreRaw = Number(formData.get(`criterionScore:${criterion.criterionKey}`) ?? criterion.score);
    const comment = String(
      formData.get(`criterionComment:${criterion.criterionKey}`) ?? criterion.comment,
    ).trim();

    return {
      ...criterion,
      score: clampScore(scoreRaw, criterion.maxScore),
      comment: comment || criterion.comment,
    };
  });

  const totalScore = criteriaScores.reduce((sum, criterion) => sum + criterion.score, 0);
  const praise = String(formData.get("praise") ?? "").trim() || baseResult.praise;
  const mistakesToNote = parseTextList(
    String(formData.get("mistakesToNote") ?? ""),
    baseResult.mistakesToNote,
  );
  const improvementSuggestions = parseTextList(
    String(formData.get("improvementSuggestions") ?? ""),
    baseResult.improvementSuggestions,
  );

  return {
    totalScore,
    maxScore: baseResult.maxScore,
    confidence: asConfidenceLevel(String(formData.get("confidence") ?? ""), "high"),
    needsHumanReview: false,
    reviewReason: "",
    ocrQuality: baseResult.ocrQuality,
    recognizedText: baseResult.recognizedText,
    praise,
    mistakesToNote,
    improvementSuggestions,
    criteriaScores,
  };
}

function getReviewSource(
  complaint: HomeworkComplaintRecord | undefined,
  baseResult: NormalizedGradingResult,
): HomeworkReviewSource {
  if (complaint) {
    return "grading_complaint";
  }

  if (baseResult.needsHumanReview) {
    return "needs_review";
  }

  return "manual_teacher_review";
}

function detectCriterionChanges(
  baseResult: NormalizedGradingResult,
  finalResult: NormalizedGradingResult,
) {
  return finalResult.criteriaScores.some((criterion, index) => {
    const baseCriterion = baseResult.criteriaScores[index];

    return (
      criterion.score !== baseCriterion?.score ||
      criterion.comment.trim() !== (baseCriterion?.comment ?? "").trim()
    );
  });
}

function detectFeedbackChanges(
  baseResult: NormalizedGradingResult,
  finalResult: NormalizedGradingResult,
) {
  const baseMistakes = baseResult.mistakesToNote.join("\n").trim();
  const finalMistakes = finalResult.mistakesToNote.join("\n").trim();
  const baseImprovements = baseResult.improvementSuggestions.join("\n").trim();
  const finalImprovements = finalResult.improvementSuggestions.join("\n").trim();

  return (
    baseResult.praise.trim() !== finalResult.praise.trim() ||
    baseMistakes !== finalMistakes ||
    baseImprovements !== finalImprovements ||
    detectCriterionChanges(baseResult, finalResult)
  );
}

function getLatencySeconds(
  submissionSubmittedAt: string,
  complaintCreatedAt: string | undefined,
  now: string,
) {
  const startedAt = complaintCreatedAt ?? submissionSubmittedAt;
  const startTimestamp = new Date(startedAt).getTime();
  const endTimestamp = new Date(now).getTime();

  if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp)) {
    return 0;
  }

  return Math.max(0, Math.round((endTimestamp - startTimestamp) / 1000));
}

export async function createTeacherReview(formData: FormData) {
  const repository = getHomeworkAiRepository();
  const submissionId = String(formData.get("submissionId") ?? "").trim();
  const complaintId = String(formData.get("complaintId") ?? "").trim();
  const teacherName = String(formData.get("teacherName") ?? "").trim();
  const teacherNote = String(formData.get("teacherNote") ?? "").trim();
  const decisionRaw = String(formData.get("decision") ?? "").trim();
  const decision: HomeworkReviewDecision =
    decisionRaw === "edited_result" ? "edited_result" : "approved_ai";

  if (!submissionId || !teacherName) {
    throw new Error("Can nhap nguoi ra soat va bai nop can xu ly.");
  }

  const submission = await repository.findSubmissionById(submissionId);

  if (!submission) {
    throw new Error("Khong tim thay bai nop can ra soat.");
  }

  if (!submission.result) {
    throw new Error("Bai nop nay chua co ket qua AI de giao vien ra soat.");
  }

  if (decision === "edited_result" && !teacherNote) {
    throw new Error("Ban phai nhap ghi chu giao vien khi chon chinh tay ket qua.");
  }

  const finalResult =
    decision === "edited_result"
      ? buildEditedFinalResult(formData, submission.result)
      : buildApprovedFinalResult(submission.result);

  let complaint: HomeworkComplaintRecord | undefined;
  if (complaintId) {
    complaint = await repository.findComplaintById(complaintId);

    if (!complaint) {
      throw new Error("Khong tim thay khieu nai can dong.");
    }

    if (complaint.submissionId !== submission.id) {
      throw new Error("Khieu nai khong thuoc bai nop nay.");
    }

    if (complaint.category !== "grading_issue") {
      throw new Error("Chi khieu nai cham diem moi duoc dong bang teacher review.");
    }
  }

  const changedScore =
    submission.result.totalScore !== finalResult.totalScore ||
    submission.result.criteriaScores.some(
      (criterion, index) => criterion.score !== finalResult.criteriaScores[index]?.score,
    );
  const changedCriteria = detectCriterionChanges(submission.result, finalResult);
  const changedFeedback = detectFeedbackChanges(submission.result, finalResult);

  if (decision === "edited_result" && !changedCriteria) {
    throw new Error(
      "Ban chi duoc luu edited_result khi it nhat 1 tieu chi da doi diem hoac doi nhan xet so voi AI goc.",
    );
  }

  const priorReviews = await repository.findReviewsBySubmissionId(submission.id);

  const now = nowIso();
  const review: HomeworkReviewRecord = {
    id: randomUUID(),
    submissionId: submission.id,
    assignmentId: submission.assignmentId,
    complaintId: complaintId || undefined,
    teacherName,
    reviewerIdentitySource: "manual_name",
    decision,
    reviewSource: getReviewSource(complaint, submission.result),
    reviewVersion: priorReviews.length + 1,
    teacherNote,
    aiResultSnapshot: submission.result,
    finalResult,
    changedScore,
    changedFeedback,
    totalScoreDelta: Number(
      (finalResult.totalScore - submission.result.totalScore).toFixed(2),
    ),
    reviewLatencySeconds: getLatencySeconds(
      submission.submittedAt,
      complaint?.createdAt,
      now,
    ),
    createdAt: now,
    updatedAt: now,
  };

  submission.status = "graded";
  submission.updatedAt = now;
  submission.errorMessage = undefined;
  await repository.updateSubmission(submission);
  await repository.createReview(review);

  if (complaint) {
    complaint.status = "resolved";
    complaint.updatedAt = now;
    await repository.updateComplaint(complaint);
  }

  return review;
}
