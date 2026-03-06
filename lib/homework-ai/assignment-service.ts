import { randomUUID } from "node:crypto";

import { HOMEWORK_RUBRIC_CRITERIA } from "@/lib/homework-ai/constants";
import { getHomeworkFileStorage } from "@/lib/homework-ai/file-storage";
import { getHomeworkAiRepository } from "@/lib/homework-ai/file-repository";
import { getHomeworkAiPolicy } from "@/lib/homework-ai/policy";
import { getFormFiles, nowIso, parseRubricFromConfig } from "@/lib/homework-ai/shared";
import type { HomeworkAssignmentRecord } from "@/lib/homework-ai/types";

export async function createHomeworkAssignment(formData: FormData) {
  const repository = getHomeworkAiRepository();
  const fileStorage = getHomeworkFileStorage();
  const policy = getHomeworkAiPolicy();
  const classCode = String(formData.get("classCode") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const answerKey = String(formData.get("answerKey") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "").trim();
  const dueAt = String(formData.get("dueAt") ?? "").trim();
  const rubric = parseRubricFromConfig(formData, HOMEWORK_RUBRIC_CRITERIA);
  const files = getFormFiles(formData, "attachments");

  if (!classCode || !title || !instructions || !answerKey || !startsAt || !dueAt) {
    throw new Error("Thieu thong tin bat buoc de giao bai.");
  }

  const startsAtDate = new Date(startsAt);
  const dueAtDate = new Date(dueAt);

  if (Number.isNaN(startsAtDate.getTime()) || Number.isNaN(dueAtDate.getTime())) {
    throw new Error("Thoi gian bat dau hoac ket thuc khong hop le.");
  }

  if (dueAtDate.getTime() <= startsAtDate.getTime()) {
    throw new Error("Han nop phai sau thoi gian bat dau.");
  }

  const assignmentId = randomUUID();
  const attachments = await fileStorage.persistFiles(
    files,
    assignmentId,
    "assignment",
    new Set(policy.allowedAssignmentMimeTypes),
  );
  const maxScore = rubric.reduce((total, criterion) => total + criterion.maxScore, 0);
  const now = nowIso();

  const assignment: HomeworkAssignmentRecord = {
    id: assignmentId,
    classCode,
    title,
    instructions,
    answerKey,
    attachments,
    rubric,
    maxScore,
    startsAt: startsAtDate.toISOString(),
    dueAt: dueAtDate.toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  await repository.createAssignment(assignment);
  return assignment;
}
