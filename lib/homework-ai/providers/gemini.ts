import type {
  HomeworkSubmissionInput,
  ProviderGradingResponse,
} from "@/lib/homework-ai/types";
import { AiGradingProvider } from "@/lib/homework-ai/providers/base";
import { normalizeGradingResult } from "@/lib/homework-ai/grading";

interface GeminiTextPart {
  text: string;
}

interface GeminiInlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

type GeminiPart = GeminiTextPart | GeminiInlineDataPart;

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-pro";
const PROMPT_VERSION = "homework-image-v2";

function buildPrompt(input: HomeworkSubmissionInput) {
  const rubricText = input.assignment.rubric
    .map(
      (criterion) =>
        `- ${criterion.label}: ${criterion.maxScore} diem. Luu y: ${criterion.notes || "khong co"}`,
    )
    .join("\n");

  return [
    "Ban la he thong cham bai tap cua MIU.",
    "Khi nhan xet voi hoc sinh, hay xung ho la `MIU` va goi hoc sinh la `ban`.",
    "Giọng van phai ton trong, ngan gon, khich le, khong phan xet, khong noi hoc sinh yeu, kem hay cau tha.",
    "Neu anh mo, thieu trang, kho doc, hoac khong du can cu cham, phai giam confidence va bat needsHumanReview = true.",
    "Tuyet doi khong duoc bịa noi dung khong doc duoc tu anh.",
    `Tieu de bai tap: ${input.assignment.title}`,
    `Lop: ${input.classCode}`,
    `Thoi gian nop muon: ${input.isLate ? "Co" : "Khong"}`,
    `Huong dan bai tap: ${input.assignment.instructions}`,
    `Dap an mau de doi chieu: ${input.assignment.answerKey}`,
    `Tong diem toi da: ${input.assignment.maxScore}`,
    `Rubric:\n${rubricText}`,
    "Tra ve JSON hop le theo schema. Bat buoc phai co totalScore, praise, mistakesToNote, improvementSuggestions, criteriaScores, confidence, needsHumanReview, reviewReason, recognizedText.",
  ].join("\n\n");
}

function buildSchema() {
  return {
    type: "OBJECT",
    properties: {
      totalScore: { type: "NUMBER" },
      maxScore: { type: "NUMBER" },
      confidence: {
        type: "STRING",
        enum: ["high", "medium", "low"],
      },
      needsHumanReview: { type: "BOOLEAN" },
      reviewReason: { type: "STRING" },
      ocrQuality: {
        type: "STRING",
        enum: ["high", "medium", "low"],
      },
      recognizedText: { type: "STRING" },
      praise: { type: "STRING" },
      mistakesToNote: {
        type: "ARRAY",
        items: { type: "STRING" },
      },
      improvementSuggestions: {
        type: "ARRAY",
        items: { type: "STRING" },
      },
      criteriaScores: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            criterionKey: {
              type: "STRING",
              enum: [
                "analysis_and_strategy",
                "calculation_skill",
                "presentation",
              ],
            },
            label: { type: "STRING" },
            score: { type: "NUMBER" },
            maxScore: { type: "NUMBER" },
            comment: { type: "STRING" },
          },
          required: ["criterionKey", "label", "score", "maxScore", "comment"],
        },
      },
    },
    required: [
      "totalScore",
      "maxScore",
      "confidence",
      "needsHumanReview",
      "reviewReason",
      "ocrQuality",
      "recognizedText",
      "praise",
      "mistakesToNote",
      "improvementSuggestions",
      "criteriaScores",
    ],
  };
}

function extractJsonText(payload: GeminiGenerateContentResponse) {
  return payload?.candidates?.[0]?.content?.parts?.[0]?.text;
}

export class GeminiGradingProvider implements AiGradingProvider {
  readonly id = "gemini";

  async gradeSubmission(
    input: HomeworkSubmissionInput,
  ): Promise<ProviderGradingResponse> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Thieu GEMINI_API_KEY.");
    }

    const parts: GeminiPart[] = [{ text: buildPrompt(input) }];

    for (const attachment of input.assignment.attachments) {
      if (attachment.base64Data) {
        parts.push({
          inlineData: {
            mimeType: attachment.mimeType,
            data: attachment.base64Data,
          },
        });
      }
    }

    for (const image of input.images) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64Data ?? "",
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts,
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: buildSchema(),
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API loi: ${response.status} ${errorText}`);
    }

    const payload = (await response.json()) as GeminiGenerateContentResponse;
    const jsonText = extractJsonText(payload);

    if (!jsonText) {
      throw new Error("Gemini khong tra ve JSON hop le.");
    }

    const parsed = JSON.parse(jsonText);

    return {
      provider: "gemini",
      model: DEFAULT_MODEL,
      promptVersion: PROMPT_VERSION,
      result: normalizeGradingResult(parsed, input.assignment),
      rawResponse: payload,
    };
  }
}
