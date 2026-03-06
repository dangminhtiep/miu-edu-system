import type {
  HomeworkAssignmentRecord,
  HomeworkDatabase,
  RubricCriterion,
} from "@/lib/homework-ai/types";

export function sortByDateDesc<T extends { createdAt?: string; submittedAt?: string }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    const left = a.createdAt ?? a.submittedAt ?? "";
    const right = b.createdAt ?? b.submittedAt ?? "";
    return left < right ? 1 : -1;
  });
}

export function nowIso() {
  return new Date().toISOString();
}

export function getFormFiles(formData: FormData, fieldName: string) {
  return formData
    .getAll(fieldName)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export function getStudentSubmissions(
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

export function findExistingUnlock(
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

export function getAssignmentWindowState(assignment: HomeworkAssignmentRecord) {
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

export function parseRubricFromConfig(
  formData: FormData,
  rubricCriteria: Array<{ key: string; label: string }>,
): RubricCriterion[] {
  const criteria = rubricCriteria
    .map(({ key, label }) => ({
      key,
      label,
      maxScore: Number(formData.get(`${key}Score`) ?? 0),
      notes: String(formData.get(`${key}Notes`) ?? "").trim(),
    }))
    .filter((criterion) => criterion.maxScore > 0) as RubricCriterion[];

  if (criteria.length !== rubricCriteria.length) {
    throw new Error("Can khai bao day du 3 tieu chi rubric co diem hop le.");
  }

  return criteria;
}
