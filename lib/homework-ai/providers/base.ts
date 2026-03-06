import {
  HomeworkSubmissionInput,
  ProviderGradingResponse,
} from "@/lib/homework-ai/types";

export interface AiGradingProvider {
  readonly id: string;
  gradeSubmission(
    input: HomeworkSubmissionInput,
  ): Promise<ProviderGradingResponse>;
}
