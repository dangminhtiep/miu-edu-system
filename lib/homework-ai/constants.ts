import type { HomeworkComplaintCategory, RubricCriterionKey } from "@/lib/homework-ai/types";

export const HOMEWORK_RUBRIC_CRITERIA: Array<{
  key: RubricCriterionKey;
  label: string;
}> = [
  { key: "analysis_and_strategy", label: "Phan tich va huong giai" },
  { key: "calculation_skill", label: "Ky nang tinh toan" },
  { key: "presentation", label: "Trinh bay" },
];

export const HOMEWORK_COMPLAINT_CATEGORIES: HomeworkComplaintCategory[] = [
  "grading_issue",
  "wrong_submission",
];
