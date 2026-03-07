import { getHomeworkAiRepository } from "@/lib/homework-ai/file-repository";
import { nowIso } from "@/lib/homework-ai/shared";
import type {
  HomeworkAssignmentRecord,
  HomeworkComplaintRecord,
  HomeworkDatabase,
  HomeworkSubmissionRecord,
  NormalizedGradingResult,
} from "@/lib/homework-ai/types";

const SEEDED_ASSIGNMENT_ID = "seed-assignment-review";
const SEEDED_SUBMISSION_ID = "seed-submission-review";
const SEEDED_COMPLAINT_ID = "seed-complaint-review";

function buildSeedResult(): NormalizedGradingResult {
  return {
    totalScore: 7.5,
    maxScore: 10,
    confidence: "medium",
    needsHumanReview: true,
    reviewReason: "AI chua tu tin o phan trinh bay va mot buoc tinh toan.",
    ocrQuality: "medium",
    recognizedText:
      "Hoc sinh da dat an x = 4, tinh ra y = 9 nhung trinh bay chua ro rang o buoc cuoi.",
    praise: "MIU ghi nhan ban da co huong giai dung o phan lon bai lam.",
    mistakesToNote: [
      "AI nghi rang ban bi thieu mot buoc giai thich o phan cuoi.",
      "Co mot phep tinh bi tru diem qua nang nen can giao vien ra soat lai.",
    ],
    improvementSuggestions: [
      "Ban nen viet ro hon tung buoc bien doi.",
      "Ban can ghi ket luan cuoi bai day du hon.",
    ],
    criteriaScores: [
      {
        criterionKey: "analysis_and_strategy",
        label: "Phan tich va huong giai",
        score: 3.5,
        maxScore: 4,
        comment: "Huong giai co co so dung, nhung AI can giao vien xac nhan them o buoc cuoi.",
      },
      {
        criterionKey: "calculation_skill",
        label: "Ky nang tinh toan",
        score: 3,
        maxScore: 4,
        comment: "Co mot cho AI nghi hoc sinh tinh sai nhe, can ra soat lai tren anh goc.",
      },
      {
        criterionKey: "presentation",
        label: "Trinh bay",
        score: 1,
        maxScore: 2,
        comment: "Bai trinh bay duoc nhung chu viet va can le lam AI it tu tin.",
      },
    ],
  };
}

function upsertById<T extends { id: string }>(items: T[], item: T) {
  const index = items.findIndex((entry) => entry.id === item.id);
  if (index >= 0) {
    items[index] = item;
    return;
  }
  items.unshift(item);
}

export async function seedHomeworkAiMockData() {
  const repository = getHomeworkAiRepository();
  const database = await repository.readDatabase();
  const now = nowIso();
  const result = buildSeedResult();

  const assignment: HomeworkAssignmentRecord = {
    id: SEEDED_ASSIGNMENT_ID,
    classCode: "MATH-7A",
    title: "Bai tap phuong trinh bac nhat",
    instructions:
      "Giai phuong trinh va trinh bay day du cac buoc. Hoc sinh nop anh bai lam de MIU va giao vien ra soat.",
    answerKey:
      "Dat x = 4. Thay vao phuong trinh va doi chieu tung buoc bien doi de ket luan nghiem cuoi cung.",
    attachments: [],
    rubric: [
      {
        key: "analysis_and_strategy",
        label: "Phan tich va huong giai",
        maxScore: 4,
        notes: "Hoc sinh can xac dinh dung huong giai va lap luan ro rang.",
      },
      {
        key: "calculation_skill",
        label: "Ky nang tinh toan",
        maxScore: 4,
        notes: "Hoc sinh can tinh toan chinh xac o cac buoc bien doi.",
      },
      {
        key: "presentation",
        label: "Trinh bay",
        maxScore: 2,
        notes: "Hoc sinh can viet ro rang, de doc, de doi chieu.",
      },
    ],
    maxScore: 10,
    startsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  const mockImageUrl =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200">
        <rect width="100%" height="100%" fill="#f8fafc"/>
        <rect x="48" y="48" width="804" height="1104" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
        <text x="90" y="140" font-family="Arial" font-size="42" fill="#102542">Bai lam mau de test Teacher Review</text>
        <text x="90" y="230" font-family="Arial" font-size="30" fill="#334155">Hoc sinh: Nguyen An</text>
        <text x="90" y="290" font-family="Arial" font-size="30" fill="#334155">Lop: MATH-7A</text>
        <text x="90" y="390" font-family="Arial" font-size="28" fill="#0f172a">1) Dat x = 4 de thu lai nghiem.</text>
        <text x="90" y="450" font-family="Arial" font-size="28" fill="#0f172a">2) Thay vao bieu thuc va bien doi tung buoc.</text>
        <text x="90" y="510" font-family="Arial" font-size="28" fill="#0f172a">3) Ket luan nghiem x = 4.</text>
        <text x="90" y="620" font-family="Arial" font-size="24" fill="#475569">Day la anh gia lap de kiem thu split-view va zoom.</text>
      </svg>`,
    );

  const submission: HomeworkSubmissionRecord = {
    id: SEEDED_SUBMISSION_ID,
    assignmentId: assignment.id,
    assignmentTitle: assignment.title,
    studentName: "Nguyen An",
    classCode: assignment.classCode,
    attemptNumber: 1,
    isLate: false,
    imageUrls: [mockImageUrl],
    provider: "mock",
    model: "mock-review-seed-v1",
    promptVersion: "seed-2026-03-07",
    status: "needs_review",
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
    result,
  };

  const complaint: HomeworkComplaintRecord = {
    id: SEEDED_COMPLAINT_ID,
    assignmentId: assignment.id,
    submissionId: submission.id,
    studentName: submission.studentName,
    classCode: submission.classCode,
    category: "grading_issue",
    message: "Ban nghi AI tru diem phan tinh toan qua tay, nho giao vien kiem tra lai.",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: now,
  };

  upsertById(database.assignments, assignment);
  upsertById(database.submissions, submission);
  upsertById(database.complaints, complaint);

  database.reviews = database.reviews.filter(
    (review) => review.submissionId !== SEEDED_SUBMISSION_ID,
  );
  database.unlocks = database.unlocks.filter(
    (unlock) => unlock.assignmentId !== SEEDED_ASSIGNMENT_ID,
  );
  database.gradingJobs = database.gradingJobs.filter(
    (job) => job.submissionId !== SEEDED_SUBMISSION_ID,
  );

  await repository.writeDatabase(database as HomeworkDatabase);

  return {
    assignmentId: assignment.id,
    submissionId: submission.id,
    complaintId: complaint.id,
  };
}
