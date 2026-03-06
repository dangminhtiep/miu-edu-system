import { randomUUID } from "node:crypto";

import { getHomeworkFileStorage } from "@/lib/homework-ai/file-storage";
import { getHomeworkGradingExecutor } from "@/lib/homework-ai/grading-executor";
import { getHomeworkAiRepository } from "@/lib/homework-ai/file-repository";
import { getHomeworkAiPolicy } from "@/lib/homework-ai/policy";
import {
  createQueuedGradingJob,
  markGradingJobCompleted,
  markGradingJobFailed,
  markGradingJobProcessing,
} from "@/lib/homework-ai/grading-job-service";
import {
  getFormFiles,
  nowIso,
} from "@/lib/homework-ai/shared";
import type { HomeworkSubmissionInput, HomeworkSubmissionRecord } from "@/lib/homework-ai/types";

export async function submitHomeworkForAiGrading(formData: FormData) {
  const repository = getHomeworkAiRepository();
  const fileStorage = getHomeworkFileStorage();
  const gradingExecutor = getHomeworkGradingExecutor();
  const policy = getHomeworkAiPolicy();
  const assignmentId = String(formData.get("assignmentId") ?? "").trim();
  const studentName = String(formData.get("studentName") ?? "").trim();
  const classCode = String(formData.get("classCode") ?? "").trim();
  const files = getFormFiles(formData, "images");

  if (!assignmentId || !studentName || !classCode) {
    throw new Error("Thieu thong tin bat buoc de nop bai.");
  }

  if (files.length === 0) {
    throw new Error("Can tai len it nhat 1 anh bai nop.");
  }

  if (files.length > policy.maxImagesPerSubmission) {
    throw new Error(
      `Ban MVP hien tai chi ho tro toi da ${policy.maxImagesPerSubmission} anh moi bai nop.`,
    );
  }

  const assignment = await repository.findAssignmentById(assignmentId);

  if (!assignment) {
    throw new Error("Khong tim thay bai tap duoc giao.");
  }

  if (assignment.classCode.toLowerCase() !== classCode.toLowerCase()) {
    throw new Error("Ban khong thuoc dung lop cua bai tap nay.");
  }

  const priorSubmissions = await repository.findStudentSubmissions(
    assignmentId,
    studentName,
  );
  const unlock = await repository.findOpenUnlock(assignmentId, studentName);

  if (priorSubmissions.length >= policy.maxNormalSubmissionAttempts && !unlock) {
    throw new Error(
      "Ban da nop bai. Neu nop nham, hay gui khieu nai de MIU xem xet mo khoa 1 lan.",
    );
  }

  if (priorSubmissions.length >= policy.maxNormalSubmissionAttempts + 1) {
    throw new Error("Ban da su dung het so lan nop bai cho phep.");
  }

  const submissionId = randomUUID();
  const images = await fileStorage.persistFiles(
    files,
    submissionId,
    "submission",
    new Set(policy.allowedStudentMimeTypes),
  );
  const attemptNumber = priorSubmissions.length + 1;
  const isLate = Date.now() > new Date(assignment.dueAt).getTime();

  if (isLate && !policy.allowLateSubmission) {
    throw new Error("Bai tap nay da qua han nop.");
  }

  const input: HomeworkSubmissionInput = {
    assignment,
    studentName,
    classCode,
    attemptNumber,
    isLate,
    images,
  };

  const queuedAt = nowIso();
  const queuedSubmission: HomeworkSubmissionRecord = {
    id: submissionId,
    assignmentId,
    assignmentTitle: assignment.title,
    studentName,
    classCode,
    attemptNumber,
    isLate,
    imageUrls: images.map((image) => image.publicUrl),
    provider: policy.activeProvider,
    model: "pending",
    promptVersion: "pending",
    status: "queued",
    submittedAt: queuedAt,
    updatedAt: queuedAt,
  };
  const gradingJob = createQueuedGradingJob(
    submissionId,
    assignmentId,
    policy.activeProvider,
    queuedAt,
  );

  await repository.createSubmission(queuedSubmission);
  await repository.createGradingJob(gradingJob);

  if (unlock) {
    unlock.usedAt = queuedAt;
    const complaint = await repository.findComplaintById(unlock.complaintId);
    if (complaint) {
      complaint.status = "resolved";
      complaint.updatedAt = queuedAt;
      await repository.updateComplaint(complaint);
    }
    await repository.updateUnlock(unlock);
  }

  try {
    markGradingJobProcessing(gradingJob, queuedSubmission);
    await repository.updateGradingJob(gradingJob);
    await repository.updateSubmission(queuedSubmission);

    const gradingResponse = await gradingExecutor.execute(input);
    markGradingJobCompleted(gradingJob, queuedSubmission, gradingResponse);

    await repository.updateGradingJob(gradingJob);
    await repository.updateSubmission(queuedSubmission);
    return queuedSubmission;
  } catch (error) {
    markGradingJobFailed(gradingJob, queuedSubmission, error);
    await repository.updateGradingJob(gradingJob);
    await repository.updateSubmission(queuedSubmission);
    throw error;
  }
}
