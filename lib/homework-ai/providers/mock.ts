import type {
  HomeworkSubmissionInput,
  ProviderGradingResponse,
} from "@/lib/homework-ai/types";
import { AiGradingProvider } from "@/lib/homework-ai/providers/base";

export class MockGradingProvider implements AiGradingProvider {
  readonly id = "mock";

  async gradeSubmission(
    input: HomeworkSubmissionInput,
  ): Promise<ProviderGradingResponse> {
    const totalScore = Math.max(Math.round(input.assignment.maxScore * 0.8), 1);

    return {
      provider: "mock",
      model: "mock-grader-v2",
      promptVersion: "homework-image-v2",
      result: {
        totalScore,
        maxScore: input.assignment.maxScore,
        confidence: "medium",
        needsHumanReview: false,
        reviewReason: "",
        ocrQuality: "medium",
        recognizedText:
          "MIU dang o che do mock. Ket qua nay duoc tao ra de kiem tra luong giao bai, nop bai va hien thi ket qua.",
        praise:
          "MIU ghi nhan ban da hoan thanh duoc phan lon yeu cau cua bai tap.",
        mistakesToNote: [
          "Day la ket qua gia lap, chua phan anh bai lam thuc te cua ban.",
        ],
        improvementSuggestions: [
          "Khi chuyen sang Gemini, MIU se tra ve nhan xet thuc te theo rubric da giao.",
        ],
        criteriaScores: input.assignment.rubric.map((criterion, index) => ({
          criterionKey: criterion.key,
          label: criterion.label,
          score:
            index === 0
              ? Math.max(criterion.maxScore - 1, 0)
              : criterion.maxScore,
          maxScore: criterion.maxScore,
          comment:
            "Ket qua dang duoc tao boi che do mock de kiem thu giao dien va workflow.",
        })),
      },
      rawResponse: {
        mode: "mock",
      },
    };
  }
}
