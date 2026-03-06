import { randomUUID } from "node:crypto";

import { getHomeworkAiRepository } from "@/lib/homework-ai/file-repository";
import { getHomeworkAiPolicy } from "@/lib/homework-ai/policy";
import { nowIso } from "@/lib/homework-ai/shared";
import type {
  HomeworkComplaintCategory,
  HomeworkComplaintRecord,
  HomeworkUnlockRecord,
} from "@/lib/homework-ai/types";

export async function createHomeworkComplaint(formData: FormData) {
  const repository = getHomeworkAiRepository();
  const policy = getHomeworkAiPolicy();
  const assignmentId = String(formData.get("assignmentId") ?? "").trim();
  const submissionId = String(formData.get("submissionId") ?? "").trim();
  const studentName = String(formData.get("studentName") ?? "").trim();
  const classCode = String(formData.get("classCode") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const category = policy.complaintCategories.includes(
    categoryRaw as HomeworkComplaintCategory,
  )
    ? (categoryRaw as HomeworkComplaintCategory)
    : "grading_issue";

  if (!assignmentId || !submissionId || !studentName || !classCode || !message) {
    throw new Error("Can nhap day du thong tin khieu nai.");
  }

  const submission = await repository.findSubmissionById(submissionId);

  if (!submission) {
    throw new Error("Khong tim thay bai nop de khieu nai.");
  }

  const existingOpenComplaint = await repository.findOpenComplaintBySubmissionId(
    submissionId,
  );

  if (existingOpenComplaint) {
    throw new Error("Bai nop nay da co khieu nai dang xu ly.");
  }

  const now = nowIso();
  const complaint: HomeworkComplaintRecord = {
    id: randomUUID(),
    assignmentId,
    submissionId,
    studentName,
    classCode,
    category,
    message,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };

  await repository.createComplaint(complaint);
  return complaint;
}

export async function unlockOneMoreSubmission(formData: FormData) {
  const repository = getHomeworkAiRepository();
  const complaintId = String(formData.get("complaintId") ?? "").trim();

  if (!complaintId) {
    throw new Error("Thieu complaintId.");
  }

  const complaint = await repository.findComplaintById(complaintId);

  if (!complaint) {
    throw new Error("Khong tim thay khieu nai.");
  }

  if (complaint.category !== "wrong_submission") {
    throw new Error("Chi khieu nai nop nham bai moi duoc mo khoa them 1 lan.");
  }

  const existingUnlock = await repository.findUnlockByComplaintId(complaintId);

  if (existingUnlock) {
    throw new Error("Khieu nai nay da duoc mo khoa truoc do.");
  }

  const unlock: HomeworkUnlockRecord = {
    id: randomUUID(),
    assignmentId: complaint.assignmentId,
    studentName: complaint.studentName,
    complaintId,
    createdAt: nowIso(),
  };

  complaint.status = "unlocked";
  complaint.updatedAt = nowIso();
  complaint.unlockId = unlock.id;
  await repository.updateComplaint(complaint);
  await repository.createUnlock(unlock);
  return unlock;
}
