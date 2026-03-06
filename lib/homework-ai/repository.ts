import type {
  HomeworkAssignmentRecord,
  HomeworkComplaintRecord,
  HomeworkDatabase,
  HomeworkGradingJobRecord,
  HomeworkSubmissionRecord,
  HomeworkUnlockRecord,
} from "@/lib/homework-ai/types";

export interface HomeworkAiRepository {
  readDatabase(): Promise<HomeworkDatabase>;
  writeDatabase(data: HomeworkDatabase): Promise<void>;
  createAssignment(assignment: HomeworkAssignmentRecord): Promise<void>;
  findAssignmentById(assignmentId: string): Promise<HomeworkAssignmentRecord | undefined>;
  listAssignments(): Promise<HomeworkAssignmentRecord[]>;
  createSubmission(submission: HomeworkSubmissionRecord): Promise<void>;
  updateSubmission(submission: HomeworkSubmissionRecord): Promise<void>;
  listSubmissions(): Promise<HomeworkSubmissionRecord[]>;
  findSubmissionById(
    submissionId: string,
  ): Promise<HomeworkSubmissionRecord | undefined>;
  findStudentSubmissions(
    assignmentId: string,
    studentName: string,
  ): Promise<HomeworkSubmissionRecord[]>;
  createGradingJob(job: HomeworkGradingJobRecord): Promise<void>;
  updateGradingJob(job: HomeworkGradingJobRecord): Promise<void>;
  listGradingJobs(): Promise<HomeworkGradingJobRecord[]>;
  createComplaint(complaint: HomeworkComplaintRecord): Promise<void>;
  updateComplaint(complaint: HomeworkComplaintRecord): Promise<void>;
  listComplaints(): Promise<HomeworkComplaintRecord[]>;
  findComplaintById(
    complaintId: string,
  ): Promise<HomeworkComplaintRecord | undefined>;
  findOpenComplaintBySubmissionId(
    submissionId: string,
  ): Promise<HomeworkComplaintRecord | undefined>;
  createUnlock(unlock: HomeworkUnlockRecord): Promise<void>;
  updateUnlock(unlock: HomeworkUnlockRecord): Promise<void>;
  listUnlocks(): Promise<HomeworkUnlockRecord[]>;
  findOpenUnlock(
    assignmentId: string,
    studentName: string,
  ): Promise<HomeworkUnlockRecord | undefined>;
  findUnlockByComplaintId(
    complaintId: string,
  ): Promise<HomeworkUnlockRecord | undefined>;
}
