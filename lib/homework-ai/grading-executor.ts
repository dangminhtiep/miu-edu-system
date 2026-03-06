import { getAiGradingProvider } from "@/lib/homework-ai/providers";
import type {
  HomeworkSubmissionInput,
  ProviderGradingResponse,
} from "@/lib/homework-ai/types";

export interface HomeworkGradingExecutor {
  execute(input: HomeworkSubmissionInput): Promise<ProviderGradingResponse>;
}

class InlineHomeworkGradingExecutor implements HomeworkGradingExecutor {
  async execute(input: HomeworkSubmissionInput): Promise<ProviderGradingResponse> {
    const provider = getAiGradingProvider();
    return provider.gradeSubmission(input);
  }
}

const executor = new InlineHomeworkGradingExecutor();

export function getHomeworkGradingExecutor(): HomeworkGradingExecutor {
  return executor;
}
