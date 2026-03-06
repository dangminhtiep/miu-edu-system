import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { getAiGradingProvider } from "@/lib/homework-ai/providers";
import { getUploadDir, readHomeworkDatabase, writeHomeworkDatabase } from "@/lib/homework-ai/store";
import type {
  HomeworkAssignmentRecord,
  HomeworkComplaintRecord,
  HomeworkDatabase,
  HomeworkFileRecord,
  HomeworkSubmissionInput,
  HomeworkSubmissionRecord,
  HomeworkUnlockRecord,
  RubricCriterion,
  RubricCriterionKey,
} from "@/lib/homework-ai/types";

const STUDENT_ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);
const ASSIGNMENT_ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

const RUBRIC_KEYS: Array<{ key: RubricCriterionKey; label: string }> = [
  { key: "analysis_and_strategy", label: "Phân tích và hướng giải" },
  { key: "calculation_skill", label: "Kỹ năng tính toán" },
  { key: "presentation", label: "Trình bày" },
];

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

function sortByDateDesc<T extends { createdAt?: string; submittedAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = a.createdAt ?? a.submittedAt ?? "";
    const right = b.createdAt ?? b.submittedAt ?? "";
    return left < right ? 1 : -1;
  });
}

function nowIso() {
  return new Date().toISOString();
}

async function persistFiles(
  files: File[],
  entityId: string,
  category: "assignment" | "submission",
  allowedMimeTypes: Set<string>,
) {
  const uploadDir = await getUploadDir();

  return Promise.all(
    files.map(async (file, index) => {
      if (!allowedMimeTypes.has(file.type)) {
        throw new Error("Tep tai len khong dung dinh dang cho phep.");
      }

      const ext =
        path.extname(file.name) ||
        (file.type === "application/pdf"
          ? ".pdf"
          : file.type === "image/png"
            ? ".png"
            : ".jpg");

      const filename = `${category}-${entityId}-${index + 1}-${sanitizeFilename(
        file.name || `file${ext}`,
      )}`;
      const targetPath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(targetPath, buffer);

      return {
        id: randomUUID(),
        filename,
        mimeType: file.type,
        base64Data: buffer.toString("base64"),
        publicUrl: `/uploads/homework-ai/${filename}`,
      } satisfies HomeworkFileRecord;
    }),
  );
}

function getFormFiles(formData: FormData, fieldName: string) {
  return formData
    .getAll(fieldName)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function parseRubric(formData: FormData): RubricCriterion[] {
  const criteria = RUBRIC_KEYS.map(({ key, label }) => ({
    key,
    label,
    maxScore: Number(formData.get(`${key}Score`) ?? 0),
    notes: String(formData.get(`${key}Notes`) ?? "").trim(),
  })).filter((criterion) => criterion.maxScore > 0);

  if (criteria.length !== 3) {
    throw new Error("Can khai bao day du 3 tieu chi rubric co diem hop le.");
  }

  return criteria;
}

function getStudentSubmissions(
  database: HomeworkDatabase,
  assignmentId: string,
  studentName: string,
) {
  return database.submissions.filter(
    (submission) =>
      submission.assignmentId === assignmentId &&
      submission.studentName.toLowerCase() === studentName.toLowerCase(),
  );
}

function findExistingUnlock(
  database: HomeworkDatabase,
  assignmentId: string,
  studentName: string,
) {
  return database.unlocks.find(
    (unlock) =>
      unlock.assignmentId === assignmentId &&
      unlock.studentName.toLowerCase() === studentName.toLowerCase() &&
      !unlock.usedAt,
  );
}

function getAssignmentWindowState(assignment: HomeworkAssignmentRecord) {
  const now = Date.now();
  const startsAt = new Date(assignment.startsAt).getTime();
  const dueAt = new Date(assignment.dueAt).getTime();

  if (Number.isFinite(startsAt) && now < startsAt) {
    return "upcoming";
  }

  if (Number.isFinite(dueAt) && now > dueAt) {
    return "late";
  }

  return "open";
}

export async function createHomeworkAssignment(formData: FormData) {
  const classCode = String(formData.get("classCode") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const answerKey = String(formData.get("answerKey") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "").trim();
  const dueAt = String(formData.get("dueAt") ?? "").trim();
  const rubric = parseRubric(formData);
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
  const attachments = await persistFiles(
    files,
    assignmentId,
    "assignment",
    ASSIGNMENT_ALLOWED_MIME_TYPES,
  );
  const maxScore = rubric.reduce((total, criterion) => total + criterion.maxScore, 0);
  const now = nowIso();
  const database = await readHomeworkDatabase();

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

  database.assignments.unshift(assignment);
  await writeHomeworkDatabase(database);
  return assignment;
}

export async function submitHomeworkForAiGrading(formData: FormData) {
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

  if (files.length > 3) {
    throw new Error("Ban MVP hien tai chi ho tro toi da 3 anh moi bai nop.");
  }

  const database = await readHomeworkDatabase();
  const assignment = database.assignments.find((item) => item.id === assignmentId);

  if (!assignment) {
    throw new Error("Khong tim thay bai tap duoc giao.");
  }

  if (assignment.classCode.toLowerCase() !== classCode.toLowerCase()) {
    throw new Error("Ban khong thuoc dung lop cua bai tap nay.");
  }

  const priorSubmissions = getStudentSubmissions(database, assignmentId, studentName);
  const unlock = findExistingUnlock(database, assignmentId, studentName);

  if (priorSubmissions.length >= 1 && !unlock) {
    throw new Error("Ban da nop bai. Neu nop nham, hay gui khieu nai de MIU xem xet mo khoa 1 lan.");
  }

  if (priorSubmissions.length >= 2) {
    throw new Error("Ban da su dung het so lan nop bai cho phep.");
  }

  const submissionId = randomUUID();
  const images = await persistFiles(
    files,
    submissionId,
    "submission",
    STUDENT_ALLOWED_MIME_TYPES,
  );
  const attemptNumber = priorSubmissions.length + 1;
  const isLate = Date.now() > new Date(assignment.dueAt).getTime();
  const provider = getAiGradingProvider();

  const input: HomeworkSubmissionInput = {
    assignment,
    studentName,
    classCode,
    attemptNumber,
    isLate,
    images,
  };

  const queuedAt = nowIso();
  const queuedRecord: HomeworkSubmissionRecord = {
    id: submissionId,
    assignmentId,
    assignmentTitle: assignment.title,
    studentName,
    classCode,
    attemptNumber,
    isLate,
    imageUrls: images.map((image) => image.publicUrl),
    provider: provider.id as "gemini" | "mock",
    model: "pending",
    promptVersion: "pending",
    status: "queued",
    submittedAt: queuedAt,
    updatedAt: queuedAt,
  };

  database.submissions.unshift(queuedRecord);

  if (unlock) {
    unlock.usedAt = queuedAt;
    const complaint = database.complaints.find((item) => item.id === unlock.complaintId);
    if (complaint) {
      complaint.status = "resolved";
      complaint.updatedAt = queuedAt;
    }
  }

  await writeHomeworkDatabase(database);

  try {
    const gradingResponse = await provider.gradeSubmission(input);
    queuedRecord.provider = gradingResponse.provider;
    queuedRecord.model = gradingResponse.model;
    queuedRecord.promptVersion = gradingResponse.promptVersion;
    queuedRecord.status = gradingResponse.result.needsHumanReview
      ? "needs_review"
      : "graded";
    queuedRecord.updatedAt = nowIso();
    queuedRecord.result = gradingResponse.result;

    await writeHomeworkDatabase(database);
    return queuedRecord;
  } catch (error) {
    queuedRecord.status = "failed";
    queuedRecord.updatedAt = nowIso();
    queuedRecord.errorMessage =
      error instanceof Error ? error.message : "Khong xac dinh duoc loi cham bai.";

    await writeHomeworkDatabase(database);
    throw error;
  }
}

export async function createHomeworkComplaint(formData: FormData) {
  const assignmentId = String(formData.get("assignmentId") ?? "").trim();
  const submissionId = String(formData.get("submissionId") ?? "").trim();
  const studentName = String(formData.get("studentName") ?? "").trim();
  const classCode = String(formData.get("classCode") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const category =
    categoryRaw === "wrong_submission" ? "wrong_submission" : "grading_issue";

  if (!assignmentId || !submissionId || !studentName || !classCode || !message) {
    throw new Error("Can nhap day du thong tin khieu nai.");
  }

  const database = await readHomeworkDatabase();
  const submission = database.submissions.find((item) => item.id === submissionId);

  if (!submission) {
    throw new Error("Khong tim thay bai nop de khieu nai.");
  }

  const existingOpenComplaint = database.complaints.find(
    (item) => item.submissionId === submissionId && item.status !== "resolved",
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

  database.complaints.unshift(complaint);
  await writeHomeworkDatabase(database);
  return complaint;
}

export async function unlockOneMoreSubmission(formData: FormData) {
  const complaintId = String(formData.get("complaintId") ?? "").trim();

  if (!complaintId) {
    throw new Error("Thieu complaintId.");
  }

  const database = await readHomeworkDatabase();
  const complaint = database.complaints.find((item) => item.id === complaintId);

  if (!complaint) {
    throw new Error("Khong tim thay khieu nai.");
  }

  if (complaint.category !== "wrong_submission") {
    throw new Error("Chi khieu nai nop nham bai moi duoc mo khoa them 1 lan.");
  }

  const existingUnlock = database.unlocks.find(
    (item) => item.complaintId === complaintId,
  );

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
  database.unlocks.unshift(unlock);
  await writeHomeworkDatabase(database);
  return unlock;
}

export async function getHomeworkAiOverview() {
  const database = await readHomeworkDatabase();

  return {
    assignments: sortByDateDesc(database.assignments),
    submissions: sortByDateDesc(database.submissions),
    complaints: sortByDateDesc(database.complaints),
    metrics: {
      assignments: database.assignments.length,
      submissions: database.submissions.length,
      graded: database.submissions.filter((item) => item.status === "graded").length,
      review: database.submissions.filter((item) => item.status === "needs_review")
        .length,
      openComplaints: database.complaints.filter((item) => item.status === "open")
        .length,
    },
    activeProvider: process.env.HOMEWORK_AI_PROVIDER ?? "gemini",
  };
}

export function getAssignmentWindowLabel(assignment: HomeworkAssignmentRecord) {
  const state = getAssignmentWindowState(assignment);

  if (state === "upcoming") {
    return "Chưa mở nhận bài";
  }

  if (state === "late") {
    return "Quá hạn nhưng vẫn nhận bài";
  }

  return "Đang nhận bài";
}
