import { AiGradingProvider } from "@/lib/homework-ai/providers/base";
import { GeminiGradingProvider } from "@/lib/homework-ai/providers/gemini";
import { MockGradingProvider } from "@/lib/homework-ai/providers/mock";

export function getAiGradingProvider(): AiGradingProvider {
  const providerId = process.env.HOMEWORK_AI_PROVIDER ?? "gemini";

  if (providerId === "gemini") {
    return new GeminiGradingProvider();
  }

  return new MockGradingProvider();
}
