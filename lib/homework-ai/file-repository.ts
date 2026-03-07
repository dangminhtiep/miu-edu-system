import { readHomeworkDatabase, writeHomeworkDatabase } from "@/lib/homework-ai/store";
import type { HomeworkAiRepository } from "@/lib/homework-ai/repository";
import type {
  HomeworkAssignmentRecord,
  HomeworkComplaintRecord,
  HomeworkDatabase,
  HomeworkGradingJobRecord,
  HomeworkReviewRecord,
  HomeworkSubmissionRecord,
  HomeworkUnlockRecord,
} from "@/lib/homework-ai/types";

function matchesId<T extends { id: string }>(items: T[], item: T) {
  const index = items.findIndex((entry) => entry.id === item.id);
  return { index, exists: index >= 0 };
}

class FileHomeworkAiRepository implements HomeworkAiRepository {
  async readDatabase(): Promise<HomeworkDatabase> {
    return readHomeworkDatabase();
  }

  async writeDatabase(data: HomeworkDatabase): Promise<void> {
    await writeHomeworkDatabase(data);
  }

  async createAssignment(assignment: HomeworkAssignmentRecord): Promise<void> {
    const database = await this.readDatabase();
    database.assignments.unshift(assignment);
    await this.writeDatabase(database);
  }

  async findAssignmentById(assignmentId: string) {
    const database = await this.readDatabase();
    return database.assignments.find((item) => item.id === assignmentId);
  }

  async listAssignments() {
    const database = await this.readDatabase();
    return database.assignments;
  }

  async createSubmission(submission: HomeworkSubmissionRecord): Promise<void> {
    const database = await this.readDatabase();
    database.submissions.unshift(submission);
    await this.writeDatabase(database);
  }

  async updateSubmission(submission: HomeworkSubmissionRecord): Promise<void> {
    const database = await this.readDatabase();
    const { index, exists } = matchesId(database.submissions, submission);

    if (!exists) {
      throw new Error("Khong tim thay submission de cap nhat.");
    }

    database.submissions[index] = submission;
    await this.writeDatabase(database);
  }

  async listSubmissions() {
    const database = await this.readDatabase();
    return database.submissions;
  }

  async findSubmissionById(submissionId: string) {
    const database = await this.readDatabase();
    return database.submissions.find((item) => item.id === submissionId);
  }

  async findStudentSubmissions(assignmentId: string, studentName: string) {
    const database = await this.readDatabase();
    return database.submissions.filter(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.studentName.toLowerCase() === studentName.toLowerCase(),
    );
  }

  async createGradingJob(job: HomeworkGradingJobRecord): Promise<void> {
    const database = await this.readDatabase();
    database.gradingJobs.unshift(job);
    await this.writeDatabase(database);
  }

  async updateGradingJob(job: HomeworkGradingJobRecord): Promise<void> {
    const database = await this.readDatabase();
    const { index, exists } = matchesId(database.gradingJobs, job);

    if (!exists) {
      throw new Error("Khong tim thay grading job de cap nhat.");
    }

    database.gradingJobs[index] = job;
    await this.writeDatabase(database);
  }

  async listGradingJobs() {
    const database = await this.readDatabase();
    return database.gradingJobs;
  }

  async createComplaint(complaint: HomeworkComplaintRecord): Promise<void> {
    const database = await this.readDatabase();
    database.complaints.unshift(complaint);
    await this.writeDatabase(database);
  }

  async updateComplaint(complaint: HomeworkComplaintRecord): Promise<void> {
    const database = await this.readDatabase();
    const { index, exists } = matchesId(database.complaints, complaint);

    if (!exists) {
      throw new Error("Khong tim thay complaint de cap nhat.");
    }

    database.complaints[index] = complaint;
    await this.writeDatabase(database);
  }

  async listComplaints() {
    const database = await this.readDatabase();
    return database.complaints;
  }

  async findComplaintById(complaintId: string) {
    const database = await this.readDatabase();
    return database.complaints.find((item) => item.id === complaintId);
  }

  async findOpenComplaintBySubmissionId(submissionId: string) {
    const database = await this.readDatabase();
    return database.complaints.find(
      (item) => item.submissionId === submissionId && item.status !== "resolved",
    );
  }

  async createUnlock(unlock: HomeworkUnlockRecord): Promise<void> {
    const database = await this.readDatabase();
    database.unlocks.unshift(unlock);
    await this.writeDatabase(database);
  }

  async updateUnlock(unlock: HomeworkUnlockRecord): Promise<void> {
    const database = await this.readDatabase();
    const { index, exists } = matchesId(database.unlocks, unlock);

    if (!exists) {
      throw new Error("Khong tim thay unlock de cap nhat.");
    }

    database.unlocks[index] = unlock;
    await this.writeDatabase(database);
  }

  async listUnlocks() {
    const database = await this.readDatabase();
    return database.unlocks;
  }

  async findOpenUnlock(assignmentId: string, studentName: string) {
    const database = await this.readDatabase();
    return database.unlocks.find(
      (unlock) =>
        unlock.assignmentId === assignmentId &&
        unlock.studentName.toLowerCase() === studentName.toLowerCase() &&
        !unlock.usedAt,
    );
  }

  async findUnlockByComplaintId(complaintId: string) {
    const database = await this.readDatabase();
    return database.unlocks.find((item) => item.complaintId === complaintId);
  }

  async createReview(review: HomeworkReviewRecord): Promise<void> {
    const database = await this.readDatabase();
    database.reviews.unshift(review);
    await this.writeDatabase(database);
  }

  async listReviews() {
    const database = await this.readDatabase();
    return database.reviews;
  }

  async findReviewsBySubmissionId(submissionId: string) {
    const database = await this.readDatabase();
    return database.reviews.filter((item) => item.submissionId === submissionId);
  }
}

const repository = new FileHomeworkAiRepository();

export function getHomeworkAiRepository(): HomeworkAiRepository {
  return repository;
}
