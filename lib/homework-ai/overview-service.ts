import { getHomeworkAiRepository } from "@/lib/homework-ai/file-repository";
import { getHomeworkAiPolicy } from "@/lib/homework-ai/policy";
import { getAssignmentWindowState, sortByDateDesc } from "@/lib/homework-ai/shared";
import type { HomeworkAssignmentRecord } from "@/lib/homework-ai/types";

export async function getHomeworkAiOverview() {
  const repository = getHomeworkAiRepository();
  const assignments = await repository.listAssignments();
  const submissions = await repository.listSubmissions();
  const complaints = await repository.listComplaints();
  const gradingJobs = await repository.listGradingJobs();
  const reviews = await repository.listReviews();

  return {
    assignments: sortByDateDesc(assignments),
    submissions: sortByDateDesc(submissions),
    gradingJobs: sortByDateDesc(gradingJobs),
    complaints: sortByDateDesc(complaints),
    reviews: sortByDateDesc(reviews),
    metrics: {
      assignments: assignments.length,
      submissions: submissions.length,
      queuedJobs: gradingJobs.filter((item) => item.status === "queued").length,
      processingJobs: gradingJobs.filter((item) => item.status === "processing").length,
      graded: submissions.filter((item) => item.status === "graded").length,
      review: submissions.filter((item) => item.status === "needs_review").length,
      failedJobs: gradingJobs.filter((item) => item.status === "failed").length,
      openComplaints: complaints.filter((item) => item.status === "open").length,
    },
    activeProvider: getHomeworkAiPolicy().activeProvider,
  };
}

export function getAssignmentWindowLabel(assignment: HomeworkAssignmentRecord) {
  const state = getAssignmentWindowState(assignment);

  if (state === "upcoming") {
    return "Chua mo nhan bai";
  }

  if (state === "late") {
    return "Qua han nhung van nhan bai";
  }

  return "Dang nhan bai";
}
